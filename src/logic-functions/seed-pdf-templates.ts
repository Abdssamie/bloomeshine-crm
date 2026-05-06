import { defineLogicFunction } from 'twenty-sdk/define';

import { LOGIC_FUNCTION } from 'src/constants/universal-identifiers';
import {
  core,
  createPdfTemplate,
  findPdfTemplateByName,
} from 'src/logic-functions/_revenue-ops';
import {
  defaultContractTemplate,
  defaultInvoiceTemplate,
} from 'src/logic-functions/templates';

const seedTemplate = async ({
  name,
  kind,
  htmlSource,
  cssSource,
}: {
  name: string;
  kind: 'INVOICE' | 'CONTRACT';
  htmlSource: string;
  cssSource: string;
}) => {
  const client = core();
  const existing = await findPdfTemplateByName(client, name);

  if (existing) {
    return { id: existing.id, name, kind, created: false };
  }

  const result = (await createPdfTemplate(client, {
    name,
    kind,
    isActive: true,
    htmlSource,
    cssSource,
  })) as { createPdfTemplate?: { id: string } };

  return { id: result.createPdfTemplate?.id, name, kind, created: true };
};

const handler = async () => {
  const invoice = await seedTemplate({
    name: 'Default Invoice',
    kind: 'INVOICE',
    ...defaultInvoiceTemplate,
  });
  const contract = await seedTemplate({
    name: 'Default Contract',
    kind: 'CONTRACT',
    ...defaultContractTemplate,
  });

  return { templates: [invoice, contract] };
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTION.seedPdfTemplates,
  name: 'Seed PDF Templates',
  description: 'Create default active invoice and contract PDF templates.',
  timeoutSeconds: 30,
  isTool: true,
  toolInputSchema: {
    type: 'object',
    properties: {},
  },
  handler,
});
