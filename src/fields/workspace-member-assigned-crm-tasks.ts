import {
  FieldType,
  RelationType,
  STANDARD_OBJECT,
  defineField,
} from 'twenty-sdk/define';

import { FIELD, OBJECT } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD.workspaceMemberAssignedCrmTasks,
  objectUniversalIdentifier: STANDARD_OBJECT.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'assignedCrmTasks',
  label: 'Assigned CRM Tasks',
  icon: 'IconCheckbox',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: OBJECT.crmTask,
  relationTargetFieldMetadataUniversalIdentifier: FIELD.crmTaskAssignee,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
