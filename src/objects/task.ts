import { FieldType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, manyToOne, select } from 'src/objects/_helpers';

export default defineObject({
  universalIdentifier: OBJECT.crmTask,
  nameSingular: 'crmTask',
  namePlural: 'crmTasks',
  labelSingular: 'Task',
  labelPlural: 'Tasks',
  description: 'Operational task for campaign, deal, and creator workflow follow-up.',
  icon: 'IconCheckbox',
  isSearchable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: fieldId(OBJECT.crmTask, 'title'),
  fields: [
    { universalIdentifier: fieldId(OBJECT.crmTask, 'title'), type: FieldType.TEXT, name: 'title', label: 'Title', icon: 'IconCheckbox', isNullable: true, defaultValue: "''" },
    {
      universalIdentifier: fieldId(OBJECT.crmTask, 'status'),
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      isNullable: true,
      defaultValue: "'TO_DO'",
      options: select(['To do', 'In progress', 'Done']),
    },
    {
      universalIdentifier: fieldId(OBJECT.crmTask, 'priority'),
      type: FieldType.SELECT,
      name: 'priority',
      label: 'Priority',
      icon: 'IconFlag',
      isNullable: true,
      defaultValue: "'NORMAL'",
      options: select(['Low', 'Normal', 'High', 'Urgent']),
    },
    { universalIdentifier: fieldId(OBJECT.crmTask, 'dueDate'), type: FieldType.DATE, name: 'dueDate', label: 'Due', icon: 'IconCalendarDue', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.crmTask, 'body'), type: FieldType.RICH_TEXT, name: 'body', label: 'Body', icon: 'IconAlignLeft', isNullable: true },
    manyToOne({
      universalIdentifier: fieldId(OBJECT.crmTask, 'campaign'),
      name: 'campaign',
      label: 'Campaign',
      icon: 'IconTargetArrow',
      targetObject: OBJECT.campaign,
      targetField: fieldId(OBJECT.campaign, 'tasks'),
    }),
    manyToOne({
      universalIdentifier: fieldId(OBJECT.crmTask, 'deal'),
      name: 'deal',
      label: 'Deal',
      icon: 'IconHandshake',
      targetObject: OBJECT.deal,
      targetField: fieldId(OBJECT.deal, 'tasks'),
    }),
  ],
});
