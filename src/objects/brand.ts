import { FieldType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, oneToMany, select } from 'src/objects/_helpers';

export default defineObject({
  universalIdentifier: OBJECT.brand,
  nameSingular: 'brand',
  namePlural: 'brands',
  labelSingular: 'Brand',
  labelPlural: 'Brands',
  description: 'High-value brand lead or client for influencer marketing campaigns.',
  icon: 'IconBuildingStore',
  isSearchable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: fieldId(OBJECT.brand, 'name'),
  fields: [
    { universalIdentifier: fieldId(OBJECT.brand, 'name'), type: FieldType.TEXT, name: 'name', label: 'Brand Name', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'website'), type: FieldType.LINKS, name: 'website', label: 'Website', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'industry'), type: FieldType.TEXT, name: 'industry', label: 'Industry', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'subNiche'), type: FieldType.TEXT, name: 'subNiche', label: 'Sub-niche', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'region'), type: FieldType.TEXT, name: 'region', label: 'Region', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'instagramUrl'), type: FieldType.LINKS, name: 'instagramUrl', label: 'Instagram', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'linkedInUrl'), type: FieldType.LINKS, name: 'linkedInUrl', label: 'LinkedIn', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'billingAddress'), type: FieldType.ADDRESS, name: 'billingAddress', label: 'Billing Address', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'contactName'), type: FieldType.TEXT, name: 'contactName', label: 'Contact Name', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'contactTitle'), type: FieldType.TEXT, name: 'contactTitle', label: 'Contact Title', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'contactEmail'), type: FieldType.EMAILS, name: 'contactEmail', label: 'Contact Email', isNullable: true },
    {
      universalIdentifier: fieldId(OBJECT.brand, 'status'),
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      isNullable: true,
      defaultValue: "'PROSPECT'",
      options: select(['Prospect', 'Qualified', 'Proposal-Sent', 'Negotiation', 'Active-Client', 'Dormant']),
    },
    {
      universalIdentifier: fieldId(OBJECT.brand, 'replyStatus'),
      type: FieldType.SELECT,
      name: 'replyStatus',
      label: 'Reply Status',
      isNullable: true,
      options: select(['Not-Contacted', 'Contacted', 'Replied', 'Not-Interested', 'Bounced']),
    },
    { universalIdentifier: fieldId(OBJECT.brand, 'lastInteractionAt'), type: FieldType.DATE_TIME, name: 'lastInteractionAt', label: 'Last Interaction', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'notes'), type: FieldType.RICH_TEXT, name: 'notes', label: 'Notes', isNullable: true },
    oneToMany({
      universalIdentifier: fieldId(OBJECT.brand, 'campaigns'),
      name: 'campaigns',
      label: 'Campaigns',
      targetObject: OBJECT.campaign,
      targetField: fieldId(OBJECT.campaign, 'brand'),
    }),
  ],
});
