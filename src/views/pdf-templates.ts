import {
  ViewOpenRecordIn,
  ViewType,
  ViewVisibility,
  defineView,
  generateDefaultFieldUniversalIdentifier,
} from "twenty-sdk/define";

import { OBJECT, VIEW } from "src/constants/universal-identifiers";

const viewField = (fieldName: string, position: number) => ({
  universalIdentifier: generateDefaultFieldUniversalIdentifier({
    objectUniversalIdentifier: VIEW.pdfTemplates,
    fieldName,
  }),
  fieldMetadataUniversalIdentifier : generateDefaultFieldUniversalIdentifier({
    objectUniversalIdentifier: OBJECT.pdfTemplate,
    fieldName,
  }),
  position,
  isVisible: true,
});

export default defineView({
  universalIdentifier: VIEW.pdfTemplates,
  name: "PDF Templates",
  objectUniversalIdentifier: OBJECT.pdfTemplate,
  type: ViewType.TABLE,
  position: 70,
  visibility: ViewVisibility.WORKSPACE,
  openRecordIn: ViewOpenRecordIn.RECORD_PAGE,
  fields: [
    viewField("name", 0),
    viewField("kind", 1),
    viewField("isActive", 2),
    viewField("htmlSource", 3),
    viewField("cssSource", 4),
    viewField("previewUrl", 5),
    viewField("lastPreviewedAt", 6),
  ],
});
