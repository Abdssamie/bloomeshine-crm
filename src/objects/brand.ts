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
    { universalIdentifier: fieldId(OBJECT.brand, 'name'), type: FieldType.TEXT, name: 'name', label: 'Name', icon: 'IconBuildingStore', isNullable: true, defaultValue: "''" },
    { universalIdentifier: fieldId(OBJECT.brand, 'website'), type: FieldType.LINKS, name: 'website', label: 'Website', icon: 'IconWorld', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'industry'), type: FieldType.TEXT, name: 'industry', label: 'Industry', icon: 'IconBriefcase', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'subNiche'), type: FieldType.TEXT, name: 'subNiche', label: 'Niche', icon: 'IconCategory', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'region'), type: FieldType.TEXT, name: 'region', label: 'Region', icon: 'IconMapPin', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'instagramUrl'), type: FieldType.LINKS, name: 'instagramUrl', label: 'Instagram', icon: 'IconBrandInstagram', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'linkedInUrl'), type: FieldType.LINKS, name: 'linkedInUrl', label: 'LinkedIn', icon: 'IconBrandLinkedin', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'billingAddress'), type: FieldType.ADDRESS, name: 'billingAddress', label: 'Billing', icon: 'IconMap2', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'contactName'), type: FieldType.TEXT, name: 'contactName', label: 'Contact', icon: 'IconUser', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'contactTitle'), type: FieldType.TEXT, name: 'contactTitle', label: 'Role', icon: 'IconIdBadge2', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'contactEmail'), type: FieldType.EMAILS, name: 'contactEmail', label: 'Email', icon: 'IconMail', isNullable: true },
    {
      universalIdentifier: fieldId(OBJECT.brand, 'status'),
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      isNullable: true,
      defaultValue: "'PROSPECT'",
      options: select(['Prospect', 'Qualified', 'Proposal-Sent', 'Negotiation', 'Active-Client', 'Dormant']),
    },
    {
      universalIdentifier: fieldId(OBJECT.brand, 'replyStatus'),
      type: FieldType.SELECT,
      name: 'replyStatus',
      label: 'Reply',
      icon: 'IconMessageCircle',
      isNullable: true,
      options: select(['Not-Contacted', 'Contacted', 'Replied', 'Not-Interested', 'Bounced']),
    },
    { universalIdentifier: fieldId(OBJECT.brand, 'lastInteractionAt'), type: FieldType.DATE_TIME, name: 'lastInteractionAt', label: 'Last Touch', icon: 'IconClock', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.brand, 'notes'), type: FieldType.RICH_TEXT, name: 'notes', label: 'Notes', icon: 'IconNotes', isNullable: true },
    oneToMany({
      universalIdentifier: fieldId(OBJECT.brand, 'campaigns'),
      name: 'campaigns',
      label: 'Campaigns',
      icon: 'IconTargetArrow',
      targetObject: OBJECT.campaign,
      targetField: fieldId(OBJECT.campaign, 'brand'),
    }),
  ],
});
