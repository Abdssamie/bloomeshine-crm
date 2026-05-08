import {
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT,
  defineField,
} from 'twenty-sdk/define';

import { FIELD, OBJECT } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD.crmTaskAssignee,
  objectUniversalIdentifier: OBJECT.crmTask,
  type: FieldType.RELATION,
  name: 'assignee',
  label: 'Assignee',
  icon: 'IconUserCheck',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD.workspaceMemberAssignedCrmTasks,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'assigneeId',
  },
});
