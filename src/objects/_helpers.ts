import {
  FieldType,
  OnDeleteAction,
  RelationType,
  generateDefaultFieldUniversalIdentifier,
} from 'twenty-sdk/define';

export const fieldId = (objectUniversalIdentifier: string, fieldName: string) =>
  generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier, fieldName });

export const select = (labels: string[]) =>
  labels.map((label, position) => ({
    label,
    value: label.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '').toUpperCase(),
    position,
    color: (
      [
        'gray',
        'blue',
        'green',
        'yellow',
        'orange',
        'red',
        'purple',
        'pink',
        'sky',
        'turquoise',
      ] as const
    )[position % 10],
  }));

export const manyToOne = ({
  universalIdentifier,
  name,
  label,
  icon,
  targetObject,
  targetField,
}: {
  universalIdentifier: string;
  name: string;
  label: string;
  icon?: string;
  targetObject: string;
  targetField: string;
}) => ({
  universalIdentifier,
  type: FieldType.RELATION as const,
  name,
  label,
  icon,
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: targetObject,
  relationTargetFieldMetadataUniversalIdentifier: targetField,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
      joinColumnName: `${name}Id`,
  },
});

export const oneToMany = ({
  universalIdentifier,
  name,
  label,
  icon,
  targetObject,
  targetField,
}: {
  universalIdentifier: string;
  name: string;
  label: string;
  icon?: string;
  targetObject: string;
  targetField: string;
}) => ({
  universalIdentifier,
  type: FieldType.RELATION as const,
  name,
  label,
  icon,
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: targetObject,
  relationTargetFieldMetadataUniversalIdentifier: targetField,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
