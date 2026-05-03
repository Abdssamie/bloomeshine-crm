import { FieldType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, manyToOne, select } from 'src/objects/_helpers';

export default defineObject({
  universalIdentifier: OBJECT.contract,
  nameSingular: 'contract',
  namePlural: 'contracts',
  labelSingular: 'Contract',
  labelPlural: 'Contracts',
  description: 'Contract artifact and lifecycle for a deal. Deal remains source of truth for terms.',
  icon: 'IconFileCertificate',
  isSearchable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: fieldId(OBJECT.contract, 'title'),
  fields: [
    { universalIdentifier: fieldId(OBJECT.contract, 'title'), type: FieldType.TEXT, name: 'title', label: 'Title', isNullable: false },
    { universalIdentifier: fieldId(OBJECT.contract, 'contractType'), type: FieldType.SELECT, name: 'contractType', label: 'Type', isNullable: false, defaultValue: "'LIGHT_AGREEMENT'", options: select(['Light-Agreement', 'NDA', 'Three-Party']) },
    { universalIdentifier: fieldId(OBJECT.contract, 'status'), type: FieldType.SELECT, name: 'status', label: 'Status', isNullable: false, defaultValue: "'DRAFT'", options: select(['Draft', 'Sent', 'Signed']) },
    { universalIdentifier: fieldId(OBJECT.contract, 'sentAt'), type: FieldType.DATE_TIME, name: 'sentAt', label: 'Sent At', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'signedAt'), type: FieldType.DATE_TIME, name: 'signedAt', label: 'Signed At', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'documentUrl'), type: FieldType.LINKS, name: 'documentUrl', label: 'Document URL', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'version'), type: FieldType.TEXT, name: 'version', label: 'Version', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'notes'), type: FieldType.RICH_TEXT, name: 'notes', label: 'Notes', isNullable: true },
    manyToOne({ universalIdentifier: fieldId(OBJECT.contract, 'deal'), name: 'deal', label: 'Deal', targetObject: OBJECT.deal, targetField: fieldId(OBJECT.deal, 'contracts') }),
  ],
});
