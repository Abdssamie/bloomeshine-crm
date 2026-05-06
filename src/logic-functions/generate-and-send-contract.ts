import { defineLogicFunction } from 'twenty-sdk/define';

import { LOGIC_FUNCTION } from 'src/constants/universal-identifiers';
import {
  asLinks,
  convertHtmlToPdf,
  core,
  draftFileFieldId,
  env,
  firstEmail,
  getActivePdfTemplate,
  getContract,
  updateContract,
  updateDeal,
  uploadPdf,
} from 'src/logic-functions/_revenue-ops';
import { contractHtml } from 'src/logic-functions/templates';

const createDocumensoDocument = async ({
  pdf,
  filename,
  title,
  signerName,
  signerEmail,
}: {
  pdf: Buffer;
  filename: string;
  title: string;
  signerName: string;
  signerEmail: string;
}) => {
  const documensoUrl = env('DOCUMENSO_URL');
  const apiKey = env('DOCUMENSO_API_KEY');
  const form = new FormData();
  const payload = {
    type: 'DOCUMENT',
    title,
    recipients: [
      {
        email: signerEmail,
        name: signerName,
        role: 'SIGNER',
        fields: [
          {
            identifier: 0,
            type: 'SIGNATURE',
            page: 1,
            positionX: 10,
            positionY: 82,
            width: 30,
            height: 6,
          },
          {
            identifier: 0,
            type: 'DATE',
            page: 1,
            positionX: 45,
            positionY: 82,
            width: 18,
            height: 4,
          },
        ],
      },
    ],
    meta: {
      subject: `Please sign: ${title}`,
      message: 'Please review and sign this agreement.',
    },
  };

  form.append('payload', JSON.stringify(payload));
  form.append(
    'files',
    new Blob([new Uint8Array(pdf)], { type: 'application/pdf' }),
    filename,
  );

  const response = await fetch(`${documensoUrl}/api/v2/envelope/create`, {
    method: 'POST',
    headers: { Authorization: apiKey },
    body: form,
  });

  if (!response.ok) {
    throw new Error(
      `Documenso create document failed: ${response.status} ${await response.text()}`,
    );
  }

  return response.json() as Promise<Record<string, any>>;
};

const sendDocumensoDocument = async (documentId: string) => {
  const documensoUrl = env('DOCUMENSO_URL');
  const apiKey = env('DOCUMENSO_API_KEY');
  const response = await fetch(`${documensoUrl}/api/v2/envelope/distribute`, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ envelopeId: documentId }),
  });

  if (!response.ok) {
    throw new Error(
      `Documenso send document failed: ${response.status} ${await response.text()}`,
    );
  }

  return response.json().catch(() => ({})) as Promise<Record<string, any>>;
};

const handler = async ({ contractId }: { contractId: string }) => {
  const client = core();
  const contract = await getContract(client, contractId);
  const deal = contract.deal;

  if (!deal) {
    throw new Error('Contract must be related to a deal');
  }

  const signerType = contract.signerType ?? 'CREATOR';
  const signerSource =
    signerType === 'BRAND' ? deal.campaign?.brand : deal.creator;
  const signerName =
    contract.signerNameOverride ??
    signerSource?.legalName ??
    signerSource?.displayName ??
    signerSource?.contactName ??
    signerSource?.name;
  const signerEmail =
    firstEmail(contract.signerEmailOverride) ??
    firstEmail(signerSource?.contactEmail);

  if (!signerName || !signerEmail) {
    throw new Error('Signer name and email are required');
  }

  const filename = `${contract.title ?? `contract-${contract.id}`}.pdf`;
  const template = await getActivePdfTemplate(client, 'CONTRACT');
  const pdf = await convertHtmlToPdf(contractHtml(contract, template), filename);
  const draftFile = await uploadPdf(client, pdf, filename, draftFileFieldId());
  const document = await createDocumensoDocument({
    pdf,
    filename,
    title: contract.title ?? filename,
    signerName,
    signerEmail,
  });
  const documensoDocumentId = String(document.id ?? document.documentId);
  const sent = await sendDocumensoDocument(documensoDocumentId);
  const signingUrl =
    sent.signingUrl ??
    sent.recipients?.[0]?.signingUrl ??
    document.signingUrl ??
    document.recipients?.[0]?.signingUrl;

  await updateContract(client, contract.id, {
    status: 'SENT',
    sentAt: new Date().toISOString(),
    documentUrl: asLinks('Draft Contract PDF', draftFile.url),
    documensoDocumentId,
    documensoStatus: sent.status ?? document.status ?? 'SENT',
    ...(signingUrl ? { documensoSigningUrl: asLinks('Signing URL', signingUrl) } : {}),
  });

  await updateDeal(client, deal.id, {
    workflowStatus: 'CONTRACT_SENT',
  });

  return { contractId: contract.id, documensoDocumentId, draftUrl: draftFile.url };
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTION.generateAndSendContract,
  name: 'Generate And Send Contract',
  description: 'Generate a contract PDF, send it through Documenso, and sync status.',
  timeoutSeconds: 45,
  isTool: true,
  toolInputSchema: {
    type: 'object',
    properties: {
      contractId: { type: 'string', description: 'Contract record id' },
    },
    required: ['contractId'],
  },
  handler,
});
