import { FieldType, NumberDataType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, manyToOne, select } from 'src/objects/_helpers';

export default defineObject({
  universalIdentifier: OBJECT.deliverable,
  nameSingular: 'deliverable',
  namePlural: 'deliverables',
  labelSingular: 'Deliverable',
  labelPlural: 'Deliverables',
  description: 'Content item tracked from shipping through live performance.',
  icon: 'IconChecklist',
  isSearchable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: fieldId(OBJECT.deliverable, 'name'),
  fields: [
    { universalIdentifier: fieldId(OBJECT.deliverable, 'name'), type: FieldType.TEXT, name: 'name', label: 'Name', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'platform'), type: FieldType.TEXT, name: 'platform', label: 'Platform', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'contentType'), type: FieldType.TEXT, name: 'contentType', label: 'Content Type', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'draftUrl'), type: FieldType.LINKS, name: 'draftUrl', label: 'Draft URL', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'liveUrl'), type: FieldType.LINKS, name: 'liveUrl', label: 'Live URL', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'draftDueDate'), type: FieldType.DATE, name: 'draftDueDate', label: 'Draft Due Date', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'plannedPostDate'), type: FieldType.DATE, name: 'plannedPostDate', label: 'Planned Post Date', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'productShipped'), type: FieldType.BOOLEAN, name: 'productShipped', label: 'Product Shipped', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'productReceived'), type: FieldType.BOOLEAN, name: 'productReceived', label: 'Product Received', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'brandApprovalStatus'), type: FieldType.SELECT, name: 'brandApprovalStatus', label: 'Brand Approval', isNullable: true, options: select(['Pending', 'Approved', 'Changes-Requested']) },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'status'), type: FieldType.SELECT, name: 'status', label: 'Status', isNullable: true, defaultValue: "'PENDING'", options: select(['Pending', 'In-Review', 'Approved', 'Live']) },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'views'), type: FieldType.NUMBER, name: 'views', label: 'Views', isNullable: true, universalSettings: { dataType: NumberDataType.INT } },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'engagements'), type: FieldType.NUMBER, name: 'engagements', label: 'Engagements', isNullable: true, universalSettings: { dataType: NumberDataType.INT } },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'clicks'), type: FieldType.NUMBER, name: 'clicks', label: 'Clicks', isNullable: true, universalSettings: { dataType: NumberDataType.INT } },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'conversions'), type: FieldType.NUMBER, name: 'conversions', label: 'Conversions', isNullable: true, universalSettings: { dataType: NumberDataType.INT } },
    { universalIdentifier: fieldId(OBJECT.deliverable, 'roas'), type: FieldType.NUMBER, name: 'roas', label: 'ROAS', isNullable: true, universalSettings: { dataType: NumberDataType.FLOAT, decimals: 2 } },
    manyToOne({ universalIdentifier: fieldId(OBJECT.deliverable, 'deal'), name: 'deal', label: 'Deal', targetObject: OBJECT.deal, targetField: fieldId(OBJECT.deal, 'deliverables') }),
  ],
});
