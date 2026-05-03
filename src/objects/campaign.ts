import { FieldType, NumberDataType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, manyToOne, oneToMany, select } from 'src/objects/_helpers';

export default defineObject({
  universalIdentifier: OBJECT.campaign,
  nameSingular: 'campaign',
  namePlural: 'campaigns',
  labelSingular: 'Campaign',
  labelPlural: 'Campaigns',
  description: 'Brand campaign connecting client demand to creator supply.',
  icon: 'IconTargetArrow',
  isSearchable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: fieldId(OBJECT.campaign, 'title'),
  fields: [
    { universalIdentifier: fieldId(OBJECT.campaign, 'title'), type: FieldType.TEXT, name: 'title', label: 'Title', isNullable: true, defaultValue: "''" },
    { universalIdentifier: fieldId(OBJECT.campaign, 'objective'), type: FieldType.RICH_TEXT, name: 'objective', label: 'Objective', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.campaign, 'briefUrl'), type: FieldType.LINKS, name: 'briefUrl', label: 'Brief URL', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.campaign, 'portalSlug'), type: FieldType.TEXT, name: 'portalSlug', label: 'Shortlist Portal Slug', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.campaign, 'totalBudget'), type: FieldType.NUMBER, name: 'totalBudget', label: 'Total Budget', isNullable: true, universalSettings: { dataType: NumberDataType.FLOAT, decimals: 2 } },
    { universalIdentifier: fieldId(OBJECT.campaign, 'currencyCode'), type: FieldType.TEXT, name: 'currencyCode', label: 'Currency', isNullable: true, defaultValue: "'EUR'" },
    { universalIdentifier: fieldId(OBJECT.campaign, 'startDate'), type: FieldType.DATE, name: 'startDate', label: 'Start Date', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.campaign, 'endDate'), type: FieldType.DATE, name: 'endDate', label: 'End Date', isNullable: true },
    {
      universalIdentifier: fieldId(OBJECT.campaign, 'status'),
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      isNullable: true,
      defaultValue: "'DRAFTING'",
      options: select(['Drafting', 'Active', 'Completed', 'On-Hold']),
    },
    manyToOne({
      universalIdentifier: fieldId(OBJECT.campaign, 'brand'),
      name: 'brand',
      label: 'Brand',
      targetObject: OBJECT.brand,
      targetField: fieldId(OBJECT.brand, 'campaigns'),
    }),
    oneToMany({
      universalIdentifier: fieldId(OBJECT.campaign, 'deals'),
      name: 'deals',
      label: 'Deals',
      targetObject: OBJECT.deal,
      targetField: fieldId(OBJECT.deal, 'campaign'),
    }),
    oneToMany({
      universalIdentifier: fieldId(OBJECT.campaign, 'invoices'),
      name: 'invoices',
      label: 'Invoices',
      targetObject: OBJECT.invoice,
      targetField: fieldId(OBJECT.invoice, 'campaign'),
    }),
    oneToMany({
      universalIdentifier: fieldId(OBJECT.campaign, 'documents'),
      name: 'documents',
      label: 'Documents',
      targetObject: OBJECT.document,
      targetField: fieldId(OBJECT.document, 'campaign'),
    }),
  ],
});
