import { defineLogicFunction } from 'twenty-sdk/define';

import { LOGIC_FUNCTION } from 'src/constants/universal-identifiers';
import { core } from 'src/logic-functions/_revenue-ops';
import { renderPdfTemplatePreview } from 'src/logic-functions/_pdf-template-preview';

const handler = async ({ templateId }: { templateId: string }) => {
  const client = core();

  return renderPdfTemplatePreview(client, templateId);
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTION.previewPdfTemplate,
  name: 'Preview PDF Template',
  description: 'Render a PDF template with sample data through Gotenberg.',
  timeoutSeconds: 30,
  isTool: true,
  toolInputSchema: {
    type: 'object',
    properties: {
      templateId: { type: 'string', description: 'PDF Template record id' },
    },
    required: ['templateId'],
  },
  handler,
});
