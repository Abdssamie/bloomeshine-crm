import {
  ViewOpenRecordIn,
  ViewType,
  ViewVisibility,
  defineView,
  generateDefaultFieldUniversalIdentifier,
} from 'twenty-sdk/define';

import { OBJECT, VIEW } from 'src/constants/universal-identifiers';

const viewField = (fieldName: string, position: number) => ({
  universalIdentifier: generateDefaultFieldUniversalIdentifier({
    objectUniversalIdentifier: VIEW.emailTemplates,
    fieldName,
  }),
  fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({
    objectUniversalIdentifier: OBJECT.emailTemplate,
    fieldName,
  }),
  position,
  isVisible: true,
});

export default defineView({
  universalIdentifier: VIEW.emailTemplates,
  name: 'Email Templates',
  objectUniversalIdentifier: OBJECT.emailTemplate,
  type: ViewType.TABLE,
  position: 80,
  visibility: ViewVisibility.WORKSPACE,
  openRecordIn: ViewOpenRecordIn.RECORD_PAGE,
  fields: [
    viewField('name', 0),
    viewField('audience', 1),
    viewField('stage', 2),
    viewField('subject', 3),
    viewField('isActive', 4),
    viewField('brands', 5),
    viewField('creators', 6),
  ],
});
