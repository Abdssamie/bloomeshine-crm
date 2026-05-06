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
    { universalIdentifier: fieldId(OBJECT.contract, 'title'), type: FieldType.TEXT, name: 'title', label: 'Title', icon: 'IconFileCertificate', isNullable: true, defaultValue: "''" },
    { universalIdentifier: fieldId(OBJECT.contract, 'contractType'), type: FieldType.SELECT, name: 'contractType', label: 'Type', icon: 'IconFileText', isNullable: true, defaultValue: "'LIGHT_AGREEMENT'", options: select(['Light-Agreement', 'NDA', 'Three-Party']) },
    { universalIdentifier: fieldId(OBJECT.contract, 'status'), type: FieldType.SELECT, name: 'status', label: 'Status', icon: 'IconProgressCheck', isNullable: true, defaultValue: "'DRAFT'", options: select(['Draft', 'Sent', 'Signed', 'Declined', 'Voided', 'Failed']) },
    { universalIdentifier: fieldId(OBJECT.contract, 'sentAt'), type: FieldType.DATE_TIME, name: 'sentAt', label: 'Sent', icon: 'IconSend', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'signedAt'), type: FieldType.DATE_TIME, name: 'signedAt', label: 'Signed', icon: 'IconSignature', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'documentUrl'), type: FieldType.LINKS, name: 'documentUrl', label: 'Document', icon: 'IconExternalLink', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'draftFile'), type: FieldType.FILES, name: 'draftFile', label: 'Draft File', icon: 'IconFileText', isNullable: true, universalSettings: { maxNumberOfValues: 1 } },
    { universalIdentifier: fieldId(OBJECT.contract, 'signedFile'), type: FieldType.FILES, name: 'signedFile', label: 'Signed File', icon: 'IconFileCertificate', isNullable: true, universalSettings: { maxNumberOfValues: 1 } },
    { universalIdentifier: fieldId(OBJECT.contract, 'signerType'), type: FieldType.SELECT, name: 'signerType', label: 'Signer', icon: 'IconUserCheck', isNullable: true, defaultValue: "'CREATOR'", options: select(['Creator', 'Brand']) },
    { universalIdentifier: fieldId(OBJECT.contract, 'signerNameOverride'), type: FieldType.TEXT, name: 'signerNameOverride', label: 'Signer Name', icon: 'IconUserEdit', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'signerEmailOverride'), type: FieldType.EMAILS, name: 'signerEmailOverride', label: 'Signer Email', icon: 'IconMail', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'documensoDocumentId'), type: FieldType.TEXT, name: 'documensoDocumentId', label: 'Documenso ID', icon: 'IconFingerprint', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'documensoStatus'), type: FieldType.TEXT, name: 'documensoStatus', label: 'Documenso Status', icon: 'IconProgress', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'documensoSigningUrl'), type: FieldType.LINKS, name: 'documensoSigningUrl', label: 'Signing URL', icon: 'IconExternalLink', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'version'), type: FieldType.TEXT, name: 'version', label: 'Version', icon: 'IconVersions', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.contract, 'notes'), type: FieldType.RICH_TEXT, name: 'notes', label: 'Notes', icon: 'IconNotes', isNullable: true },
    manyToOne({ universalIdentifier: fieldId(OBJECT.contract, 'deal'), name: 'deal', label: 'Deal', icon: 'IconHandshake', targetObject: OBJECT.deal, targetField: fieldId(OBJECT.deal, 'contracts') }),
  ],
});
