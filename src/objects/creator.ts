import { FieldType, NumberDataType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, manyToOne, oneToMany, select } from 'src/objects/_helpers';

const number = (name: string, label: string, icon: string) => ({
  universalIdentifier: fieldId(OBJECT.creator, name),
  type: FieldType.NUMBER as const,
  name,
  label,
  icon,
  isNullable: true,
  universalSettings: { dataType: NumberDataType.FLOAT, decimals: 2 },
});

export default defineObject({
  universalIdentifier: OBJECT.creator,
  nameSingular: 'creator',
  namePlural: 'creators',
  labelSingular: 'Creator',
  labelPlural: 'Creators',
  description: 'Influencer or creator lead with performance, pricing, and logistics data.',
  icon: 'IconUserStar',
  isSearchable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: fieldId(OBJECT.creator, 'displayName'),
  fields: [
    { universalIdentifier: fieldId(OBJECT.creator, 'displayName'), type: FieldType.TEXT, name: 'displayName', label: 'Name', icon: 'IconUserStar', isNullable: true, defaultValue: "''" },
    { universalIdentifier: fieldId(OBJECT.creator, 'legalName'), type: FieldType.TEXT, name: 'legalName', label: 'Legal', icon: 'IconSignature', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.creator, 'contactEmail'), type: FieldType.EMAILS, name: 'contactEmail', label: 'Email', icon: 'IconMail', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.creator, 'profileUrl'), type: FieldType.LINKS, name: 'profileUrl', label: 'Profile', icon: 'IconExternalLink', isNullable: true },
    {
      universalIdentifier: fieldId(OBJECT.creator, 'platform'),
      type: FieldType.SELECT,
      name: 'platform',
      label: 'Platform',
      icon: 'IconDeviceMobile',
      isNullable: true,
      defaultValue: "'INSTAGRAM'",
      options: select(['Instagram', 'TikTok', 'YouTube', 'Twitch', 'Twitter', 'Facebook', 'Other']),
    },
    { universalIdentifier: fieldId(OBJECT.creator, 'categories'), type: FieldType.MULTI_SELECT, name: 'categories', label: 'Categories', icon: 'IconTags', isNullable: true, options: select(['Beauty', 'Fashion', 'Fitness', 'Gaming', 'Lifestyle', 'Tech', 'Travel', 'Food', 'Other']) },
    { universalIdentifier: fieldId(OBJECT.creator, 'country'), type: FieldType.TEXT, name: 'country', label: 'Country', icon: 'IconFlag', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.creator, 'shippingAddress'), type: FieldType.ADDRESS, name: 'shippingAddress', label: 'Shipping', icon: 'IconTruckDelivery', isNullable: true },
    number('followers', 'Followers', 'IconUsers'),
    number('averageViews', 'Views', 'IconEye'),
    number('engagementRate', 'Engagement', 'IconActivity'),
    number('cpm', 'CPM', 'IconCash'),
    number('estimatedCost', 'Est. Cost', 'IconCalculator'),
    number('typicalPayout', 'Payout', 'IconCreditCard'),
    number('typicalProfitMargin', 'Margin', 'IconChartBar'),
    { universalIdentifier: fieldId(OBJECT.creator, 'mediaKitUrl'), type: FieldType.LINKS, name: 'mediaKitUrl', label: 'Media Kit', icon: 'IconFileDescription', isNullable: true },
    {
      universalIdentifier: fieldId(OBJECT.creator, 'status'),
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      isNullable: true,
      defaultValue: "'COLLECTED'",
      options: select(['Collected', 'Vetted', 'Contacted', 'Replied', 'Onboarded', 'Blacklisted']),
    },
    manyToOne({
      universalIdentifier: fieldId(OBJECT.creator, 'emailTemplate'),
      name: 'emailTemplate',
      label: 'Email Template',
      icon: 'IconMail',
      targetObject: OBJECT.emailTemplate,
      targetField: fieldId(OBJECT.emailTemplate, 'creators'),
    }),
    oneToMany({
      universalIdentifier: fieldId(OBJECT.creator, 'deals'),
      name: 'deals',
      label: 'Deals',
      icon: 'IconHandshake',
      targetObject: OBJECT.deal,
      targetField: fieldId(OBJECT.deal, 'creator'),
    }),
  ],
});
