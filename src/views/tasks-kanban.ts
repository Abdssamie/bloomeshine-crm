import {
  AggregateOperations,
  ViewOpenRecordIn,
  ViewType,
  ViewVisibility,
  defineView,
  generateDefaultFieldUniversalIdentifier,
} from 'twenty-sdk/define';

import { FIELD, OBJECT, VIEW } from 'src/constants/universal-identifiers';

const fieldId = (fieldName: string) =>
  generateDefaultFieldUniversalIdentifier({
    objectUniversalIdentifier: OBJECT.crmTask,
    fieldName,
  });

const viewFieldId = (fieldName: string) =>
  generateDefaultFieldUniversalIdentifier({
    objectUniversalIdentifier: VIEW.tasksKanban,
    fieldName,
  });

export default defineView({
  universalIdentifier: VIEW.tasksKanban,
  name: 'Tasks',
  objectUniversalIdentifier: OBJECT.crmTask,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 55,
  visibility: ViewVisibility.WORKSPACE,
  openRecordIn: ViewOpenRecordIn.SIDE_PANEL,
  mainGroupByFieldMetadataUniversalIdentifier: fieldId('status'),
  kanbanAggregateOperation: AggregateOperations.COUNT,
  kanbanAggregateOperationFieldMetadataUniversalIdentifier: fieldId('title'),
  fields: [
    { universalIdentifier: viewFieldId('primary'), fieldMetadataUniversalIdentifier: fieldId('title'), position: 0, isVisible: true },
    { universalIdentifier: viewFieldId('priority'), fieldMetadataUniversalIdentifier: fieldId('priority'), position: 1, isVisible: true },
    { universalIdentifier: viewFieldId('dueDate'), fieldMetadataUniversalIdentifier: fieldId('dueDate'), position: 2, isVisible: true },
    { universalIdentifier: viewFieldId('body'), fieldMetadataUniversalIdentifier: fieldId('body'), position: 3, isVisible: true },
    { universalIdentifier: viewFieldId('assignee'), fieldMetadataUniversalIdentifier: FIELD.crmTaskAssignee, position: 4, isVisible: true },
    { universalIdentifier: viewFieldId('campaign'), fieldMetadataUniversalIdentifier: fieldId('campaign'), position: 5, isVisible: true },
    { universalIdentifier: viewFieldId('deal'), fieldMetadataUniversalIdentifier: fieldId('deal'), position: 6, isVisible: true },
  ],
  groups: [
    { universalIdentifier: viewFieldId('groupToDo'), fieldValue: 'TO_DO', position: 0, isVisible: true },
    { universalIdentifier: viewFieldId('groupInProgress'), fieldValue: 'IN_PROGRESS', position: 1, isVisible: true },
    { universalIdentifier: viewFieldId('groupDone'), fieldValue: 'DONE', position: 2, isVisible: true },
  ],
});
