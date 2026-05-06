import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import crypto from 'crypto';

import { LOGIC_FUNCTION } from 'src/constants/universal-identifiers';
import {
  asLinks,
  core,
  env,
  signedFileFieldId,
  updateContract,
  updateDeal,
  uploadPdf,
} from 'src/logic-functions/_revenue-ops';
import type {
  DocumensoDocumentEvent,
  DocumensoWebhookBody,
} from 'src/types/documenso';

const statusMap: Partial<Record<DocumensoDocumentEvent, string>> = {
  DOCUMENT_SENT: 'SENT',
  DOCUMENT_COMPLETED: 'SIGNED',
  DOCUMENT_REJECTED: 'DECLINED',
  DOCUMENT_CANCELLED: 'VOIDED',
};

const getHeader = (headers: unknown, name: string) => {
  const lowered = name.toLowerCase();

  if (headers instanceof Headers) {
    return headers.get(name);
  }

  if (headers && typeof headers === "object") {
    return Object.entries(headers as Record<string, unknown>).find(
      ([key]) => key.toLowerCase() === lowered
    )?.[1] as string | undefined;
  }

  return null;
};

const fetchSignedPdf = async (documentId: string) => {
  const documensoUrl = env('DOCUMENSO_URL');
  const apiKey = env('DOCUMENSO_API_KEY');
  const response = await fetch(
    `${documensoUrl}/api/v2/envelope/${documentId}/download`,
    { headers: { Authorization: apiKey } }
  );

  if (!response.ok) {
    throw new Error(
      `Documenso signed PDF download failed: ${
        response.status
      } ${await response.text()}`
    );
  }

  return Buffer.from(await response.arrayBuffer());
};

function verifyWebhookSignature(receivedSecret: string) {
  const secret = env('DOCUMENSO_WEBHOOK_SECRET');

  if (!secret)
    throw new Error('Webhook secret is not configured in this environment');

  if (secret && receivedSecret !== secret) {
    throw new Error('Invalid Documenso webhook secret');
  }

  // Use constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(receivedSecret),
      Buffer.from(secret)
    );
  } catch {
    throw new Error(
      'Error during webhook signature verification. Unauthorized'
    );
  }
}

const getWebhookBody = (routePayload: RoutePayload) =>
  (typeof routePayload.body === 'string'
    ? JSON.parse(routePayload.body)
    : routePayload.body) as DocumensoWebhookBody;

const getRejectionReason = (body: DocumensoWebhookBody) =>
  (body.payload?.recipients ?? body.payload?.Recipient ?? []).find(
    (recipient) => recipient.signingStatus === 'REJECTED',
  )?.rejectionReason;

const handler = async (routePayload: RoutePayload) => {
  const receivedSecret = getHeader(routePayload.headers, 'X-Documenso-Secret');

  if (!receivedSecret)
    throw new Error('Unexpected Error: missing X-Documenso-Secret header');

  verifyWebhookSignature(receivedSecret);

  const body = getWebhookBody(routePayload);
  const documensoEvent = String(
    body.event ?? '',
  ).toUpperCase() as DocumensoDocumentEvent;
  const documentId = String(body.payload?.id ?? '');

  if (!documentId) {
    throw new Error('Documenso webhook missing payload.id document id');
  }

  const status = statusMap[documensoEvent as DocumensoDocumentEvent];

  if (!status) {
    return { ignored: true, reason: 'unsupported_event', event: documensoEvent };
  }

  const client = core();
  const result = (await client.query({
    contract: {
      __args: { filter: { documensoDocumentId: { eq: documentId } } },
      id: true,
      deal: { id: true },
    },
  } )) as { contract?: { id: string; deal?: { id: string } } };

  if (!result.contract) {
    return { ignored: true, reason: 'contract_not_found', documentId };
  }

  const updates: Record<string, unknown> = {
    documensoStatus: documensoEvent,
  };

  if (status === 'SENT') {
    Object.assign(updates, {
      status: 'SENT',
      sentAt: body.createdAt ?? body.payload?.updatedAt ?? new Date().toISOString(),
    });
  } else if (status === 'SIGNED') {
    const pdf = await fetchSignedPdf(documentId);
    const file = await uploadPdf(
      client,
      pdf,
      `signed-contract-${documentId}.pdf`,
      signedFileFieldId()
    );

    Object.assign(updates, {
      status: 'SIGNED',
      signedAt:
        body.payload?.completedAt ??
        body.createdAt ??
        body.payload?.updatedAt ??
        new Date().toISOString(),
      documentUrl: asLinks('Signed Contract PDF', file.url),
    });

    if (result.contract.deal?.id) {
      await updateDeal(client, result.contract.deal.id, {
        workflowStatus: 'CONTRACT_SIGNED',
      });
    }
  } else if (status === 'DECLINED') {
    updates.status = status;
    const rejectionReason = getRejectionReason(body);

    if (rejectionReason) {
      updates.notes = { markdown: `Documenso rejection: ${rejectionReason}` };
    }
  } else if (status === 'VOIDED') {
    updates.status = status;
  }

  await updateContract(client, result.contract.id, updates);

  return { contractId: result.contract.id, status };
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTION.documensoWebhook,
  name: "Documenso Webhook",
  description: "Receive Documenso signing events and sync contract state.",
  timeoutSeconds: 30,
  httpRouteTriggerSettings: {
    path: "/documenso-webhook",
    httpMethod: "POST",
    isAuthRequired: false,
    forwardedRequestHeaders: ["X-Documenso-Secret"],
  },
  handler,
});
