import { defineLogicFunction } from 'twenty-sdk/define';

import { LOGIC_FUNCTION } from 'src/constants/universal-identifiers';
import {
  asLinks,
  convertHtmlToPdf,
  core,
  getActivePdfTemplate,
  getDeal,
  invoiceFileFieldId,
  updateDeal,
  uploadPdf,
} from 'src/logic-functions/_revenue-ops';
import { invoiceHtml } from 'src/logic-functions/templates';

const handler = async ({ dealId }: { dealId: string }) => {
  const client = core();
  const deal = await getDeal(client, dealId);
  const template = await getActivePdfTemplate(client, 'INVOICE');

  if (!deal.brandPrice) {
    throw new Error('Deal brand price is required before invoice generation');
  }

  const invoiceNumber = deal.invoiceNumber ?? `INV-${deal.id.slice(0, 8)}`;
  const pdf = await convertHtmlToPdf(
    invoiceHtml(deal, template),
    `${invoiceNumber}.pdf`,
  );
  const file = await uploadPdf(
    client,
    pdf,
    `${invoiceNumber}.pdf`,
    invoiceFileFieldId(),
  );

  await updateDeal(client, deal.id, {
    invoiceNumber,
    invoiceStatus: 'GENERATED',
    invoiceGeneratedAt: new Date().toISOString(),
    invoiceUrl: asLinks('Invoice PDF', file.url),
  });

  return { dealId: deal.id, invoiceNumber, fileUrl: file.url };
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTION.generateInvoicePdf,
  name: 'Generate Invoice PDF',
  description: 'Generate an invoice PDF from a deal and save it back to Twenty.',
  timeoutSeconds: 30,
  isTool: true,
  toolInputSchema: {
    type: 'object',
    properties: {
      dealId: { type: 'string', description: 'Deal record id' },
    },
    required: ['dealId'],
  },
  handler,
});
