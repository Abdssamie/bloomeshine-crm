import { FieldType, NumberDataType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, oneToMany, select } from 'src/objects/_helpers';

const number = (name: string, label: string) => ({
  universalIdentifier: fieldId(OBJECT.creator, name),
  type: FieldType.NUMBER,
  name,
  label,
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
    { universalIdentifier: fieldId(OBJECT.creator, 'displayName'), type: FieldType.TEXT, name: 'displayName', label: 'Display Name', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.creator, 'legalName'), type: FieldType.TEXT, name: 'legalName', label: 'Legal Name', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.creator, 'contactEmail'), type: FieldType.EMAILS, name: 'contactEmail', label: 'Business Email', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.creator, 'profileUrl'), type: FieldType.LINKS, name: 'profileUrl', label: 'Profile URL', isNullable: true },
    {
      universalIdentifier: fieldId(OBJECT.creator, 'platform'),
      type: FieldType.SELECT,
      name: 'platform',
      label: 'Primary Platform',
      isNullable: true,
      defaultValue: "'INSTAGRAM'",
      options: select(['Instagram', 'TikTok', 'YouTube', 'Twitch', 'Twitter', 'Facebook', 'Other']),
    },
    { universalIdentifier: fieldId(OBJECT.creator, 'categories'), type: FieldType.MULTI_SELECT, name: 'categories', label: 'Categories', isNullable: true, options: select(['Beauty', 'Fashion', 'Fitness', 'Gaming', 'Lifestyle', 'Tech', 'Travel', 'Food', 'Other']) },
    { universalIdentifier: fieldId(OBJECT.creator, 'country'), type: FieldType.TEXT, name: 'country', label: 'Country', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.creator, 'shippingAddress'), type: FieldType.ADDRESS, name: 'shippingAddress', label: 'Shipping Address', isNullable: true },
    number('followers', 'Followers'),
    number('averageViews', 'Average Views'),
    number('engagementRate', 'Engagement Rate'),
    number('cpm', 'CPM'),
    number('estimatedCost', 'Estimated Cost'),
    number('typicalPayout', 'Typical Payout'),
    number('typicalProfitMargin', 'Typical Profit Margin'),
    { universalIdentifier: fieldId(OBJECT.creator, 'mediaKitUrl'), type: FieldType.LINKS, name: 'mediaKitUrl', label: 'Media Kit', isNullable: true },
    {
      universalIdentifier: fieldId(OBJECT.creator, 'status'),
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      isNullable: true,
      defaultValue: "'COLLECTED'",
      options: select(['Collected', 'Vetted', 'Contacted', 'Replied', 'Onboarded', 'Blacklisted']),
    },
    oneToMany({
      universalIdentifier: fieldId(OBJECT.creator, 'deals'),
      name: 'deals',
      label: 'Deals',
      targetObject: OBJECT.deal,
      targetField: fieldId(OBJECT.deal, 'creator'),
    }),
    oneToMany({
      universalIdentifier: fieldId(OBJECT.creator, 'documents'),
      name: 'documents',
      label: 'Documents',
      targetObject: OBJECT.document,
      targetField: fieldId(OBJECT.document, 'creator'),
    }),
  ],
});
