import { FieldType, NumberDataType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, manyToOne, oneToMany, select } from 'src/objects/_helpers';

const money = (name: string, label: string) => ({
  universalIdentifier: fieldId(OBJECT.deal, name),
  type: FieldType.NUMBER,
  name,
  label,
  isNullable: true,
  universalSettings: { dataType: NumberDataType.FLOAT, decimals: 2 },
});

export default defineObject({
  universalIdentifier: OBJECT.deal,
  nameSingular: 'deal',
  namePlural: 'deals',
  labelSingular: 'Deal',
  labelPlural: 'Deals',
  description: 'Creator partnership inside a campaign with pricing, margin, shortlist, and workflow state.',
  icon: 'IconHandshake',
  isSearchable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: fieldId(OBJECT.deal, 'name'),
  fields: [
    { universalIdentifier: fieldId(OBJECT.deal, 'name'), type: FieldType.TEXT, name: 'name', label: 'Deal Name', isNullable: true },
    money('brandPrice', 'Brand Price'),
    money('creatorPayout', 'Creator Payout'),
    money('agencyMargin', 'Agency Margin'),
    {
      universalIdentifier: fieldId(OBJECT.deal, 'shortlistStatus'),
      type: FieldType.SELECT,
      name: 'shortlistStatus',
      label: 'Shortlist Status',
      isNullable: true,
      defaultValue: "'PROPOSED'",
      options: select(['Proposed', 'Brand-Approved', 'Rejected']),
    },
    {
      universalIdentifier: fieldId(OBJECT.deal, 'workflowStatus'),
      type: FieldType.SELECT,
      name: 'workflowStatus',
      label: 'Workflow Status',
      isNullable: true,
      defaultValue: "'DRAFTING'",
      options: select(['Drafting', 'Contract-Sent', 'Contract-Signed', 'Product-Shipped', 'Draft-Received', 'Live', 'Completed']),
    },
    { universalIdentifier: fieldId(OBJECT.deal, 'deliverablesSummary'), type: FieldType.RICH_TEXT, name: 'deliverablesSummary', label: 'Deliverables', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deal, 'timelines'), type: FieldType.RICH_TEXT, name: 'timelines', label: 'Timelines', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deal, 'paymentTerms'), type: FieldType.TEXT, name: 'paymentTerms', label: 'Payment Terms', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deal, 'usageRights'), type: FieldType.RICH_TEXT, name: 'usageRights', label: 'Usage Rights', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deal, 'exclusivity'), type: FieldType.RICH_TEXT, name: 'exclusivity', label: 'Exclusivity', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.deal, 'revisionPolicy'), type: FieldType.RICH_TEXT, name: 'revisionPolicy', label: 'Revision Policy', isNullable: true },
    manyToOne({ universalIdentifier: fieldId(OBJECT.deal, 'campaign'), name: 'campaign', label: 'Campaign', targetObject: OBJECT.campaign, targetField: fieldId(OBJECT.campaign, 'deals') }),
    manyToOne({ universalIdentifier: fieldId(OBJECT.deal, 'creator'), name: 'creator', label: 'Creator', targetObject: OBJECT.creator, targetField: fieldId(OBJECT.creator, 'deals') }),
    oneToMany({ universalIdentifier: fieldId(OBJECT.deal, 'deliverables'), name: 'deliverables', label: 'Deliverables', targetObject: OBJECT.deliverable, targetField: fieldId(OBJECT.deliverable, 'deal') }),
    oneToMany({ universalIdentifier: fieldId(OBJECT.deal, 'contracts'), name: 'contracts', label: 'Contracts', targetObject: OBJECT.contract, targetField: fieldId(OBJECT.contract, 'deal') }),
    oneToMany({ universalIdentifier: fieldId(OBJECT.deal, 'invoices'), name: 'invoices', label: 'Invoices', targetObject: OBJECT.invoice, targetField: fieldId(OBJECT.invoice, 'deal') }),
    oneToMany({ universalIdentifier: fieldId(OBJECT.deal, 'documents'), name: 'documents', label: 'Documents', targetObject: OBJECT.document, targetField: fieldId(OBJECT.document, 'deal') }),
  ],
});
