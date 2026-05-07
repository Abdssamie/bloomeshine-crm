import {
  HTTPMethod,
  defineLogicFunction,
  type RoutePayload,
} from 'twenty-sdk/define';

import { LOGIC_FUNCTION } from 'src/constants/universal-identifiers';
import { core } from 'src/logic-functions/_revenue-ops';
import { renderPdfTemplatePreview } from 'src/logic-functions/_pdf-template-preview';

const getBody = (routePayload: RoutePayload) =>
  (typeof routePayload.body === 'string'
    ? JSON.parse(routePayload.body)
    : routePayload.body) as { templateId?: unknown };

const handler = async (routePayload: RoutePayload) => {
  const templateId = getBody(routePayload).templateId;

  if (typeof templateId !== 'string' || templateId.trim().length === 0) {
    throw new Error('templateId is required');
  }

  return renderPdfTemplatePreview(core(), templateId);
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTION.previewPdfTemplateRoute,
  name: 'Preview PDF Template Route',
  description: 'Render a saved PDF template preview from the front component.',
  timeoutSeconds: 30,
  httpRouteTriggerSettings: {
    path: '/pdf-template-preview',
    httpMethod: HTTPMethod.POST,
    isAuthRequired: true,
  },
  handler,
});
