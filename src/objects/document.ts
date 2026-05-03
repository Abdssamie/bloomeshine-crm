import { FieldType, NumberDataType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, manyToOne, select } from 'src/objects/_helpers';

export default defineObject({
  universalIdentifier: OBJECT.document,
  nameSingular: 'document',
  namePlural: 'documents',
  labelSingular: 'Document',
  labelPlural: 'Documents',
  description: 'Categorized media kits, briefs, signed contracts, NDAs, and other campaign files.',
  icon: 'IconFiles',
  isSearchable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: fieldId(OBJECT.document, 'fileName'),
  fields: [
    { universalIdentifier: fieldId(OBJECT.document, 'fileName'), type: FieldType.TEXT, name: 'fileName', label: 'File Name', isNullable: true, defaultValue: "''" },
    { universalIdentifier: fieldId(OBJECT.document, 'fileUrl'), type: FieldType.LINKS, name: 'fileUrl', label: 'File URL', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.document, 'fileType'), type: FieldType.TEXT, name: 'fileType', label: 'File Type', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.document, 'fileSize'), type: FieldType.NUMBER, name: 'fileSize', label: 'File Size', isNullable: true, universalSettings: { dataType: NumberDataType.INT } },
    { universalIdentifier: fieldId(OBJECT.document, 'category'), type: FieldType.SELECT, name: 'category', label: 'Category', isNullable: true, defaultValue: "'OTHER'", options: select(['Media-Kit', 'Signed-Contract', 'Campaign-Brief', 'NDA', 'Other']) },
    { universalIdentifier: fieldId(OBJECT.document, 'uploadedAt'), type: FieldType.DATE_TIME, name: 'uploadedAt', label: 'Uploaded At', isNullable: true },
    manyToOne({ universalIdentifier: fieldId(OBJECT.document, 'creator'), name: 'creator', label: 'Creator', targetObject: OBJECT.creator, targetField: fieldId(OBJECT.creator, 'documents') }),
    manyToOne({ universalIdentifier: fieldId(OBJECT.document, 'campaign'), name: 'campaign', label: 'Campaign', targetObject: OBJECT.campaign, targetField: fieldId(OBJECT.campaign, 'documents') }),
    manyToOne({ universalIdentifier: fieldId(OBJECT.document, 'deal'), name: 'deal', label: 'Deal', targetObject: OBJECT.deal, targetField: fieldId(OBJECT.deal, 'documents') }),
  ],
});
