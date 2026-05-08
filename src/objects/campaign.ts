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
    { universalIdentifier: fieldId(OBJECT.campaign, 'title'), type: FieldType.TEXT, name: 'title', label: 'Title', icon: 'IconTargetArrow', isNullable: true, defaultValue: "''" },
    { universalIdentifier: fieldId(OBJECT.campaign, 'objective'), type: FieldType.RICH_TEXT, name: 'objective', label: 'Objective', icon: 'IconFlag3', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.campaign, 'briefUrl'), type: FieldType.LINKS, name: 'briefUrl', label: 'Brief', icon: 'IconFileText', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.campaign, 'portalSlug'), type: FieldType.TEXT, name: 'portalSlug', label: 'Portal', icon: 'IconLink', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.campaign, 'totalBudget'), type: FieldType.NUMBER, name: 'totalBudget', label: 'Budget', icon: 'IconPigMoney', isNullable: true, universalSettings: { dataType: NumberDataType.FLOAT, decimals: 2 } },
    { universalIdentifier: fieldId(OBJECT.campaign, 'currencyCode'), type: FieldType.TEXT, name: 'currencyCode', label: 'Currency', icon: 'IconCurrencyEuro', isNullable: true, defaultValue: "'EUR'" },
    { universalIdentifier: fieldId(OBJECT.campaign, 'startDate'), type: FieldType.DATE, name: 'startDate', label: 'Start', icon: 'IconCalendarPlus', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.campaign, 'endDate'), type: FieldType.DATE, name: 'endDate', label: 'End', icon: 'IconCalendarCheck', isNullable: true },
    {
      universalIdentifier: fieldId(OBJECT.campaign, 'status'),
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      isNullable: true,
      defaultValue: "'DRAFTING'",
      options: select(['Drafting', 'Active', 'Completed', 'On-Hold']),
    },
    manyToOne({
      universalIdentifier: fieldId(OBJECT.campaign, 'brand'),
      name: 'brand',
      label: 'Brand',
      icon: 'IconBuildingStore',
      targetObject: OBJECT.brand,
      targetField: fieldId(OBJECT.brand, 'campaigns'),
    }),
    oneToMany({
      universalIdentifier: fieldId(OBJECT.campaign, 'deals'),
      name: 'deals',
      label: 'Deals',
      icon: 'IconHandshake',
      targetObject: OBJECT.deal,
      targetField: fieldId(OBJECT.deal, 'campaign'),
    }),
    oneToMany({
      universalIdentifier: fieldId(OBJECT.campaign, 'tasks'),
      name: 'tasks',
      label: 'Tasks',
      icon: 'IconCheckbox',
      targetObject: OBJECT.crmTask,
      targetField: fieldId(OBJECT.crmTask, 'campaign'),
    }),
  ],
});
