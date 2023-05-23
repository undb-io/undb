import type { IFieldType } from './field.type'

const controlledFieldTypes: Set<IFieldType> = new Set([
  'id',
  'auto-increment',
  'created-at',
  'updated-at',
  'count',
  'sum',
  'average',
  'lookup',
])

export const isControlledFieldType = (type: IFieldType): boolean => controlledFieldTypes.has(type)

const displayFieldTypes: Set<IFieldType> = new Set<IFieldType>([
  'auto-increment',
  'color',
  'date',
  'email',
  // FIXME: https://github.com/undb-xyz/undb/issues/780
  // 'attachment',
  'number',
  'rating',
  'currency',
  'string',
])

export const canDisplay = (type: IFieldType): boolean => displayFieldTypes.has(type)

const notSortableFieldType: Set<IFieldType> = new Set<IFieldType>([
  'attachment',
  'collaborator',
  'parent',
  'reference',
  'tree',
])

export const isSortable = (type: IFieldType): boolean => !notSortableFieldType.has(type)

export const isNumericFieldType: Set<IFieldType> = new Set<IFieldType>([
  'number',
  'average',
  'count',
  'rating',
  'auto-increment',
  'currency',
  'sum',
])

export const isNumeric = (type: IFieldType): boolean => isNumericFieldType.has(type)

export const isAggregateFieldType: Set<IFieldType> = new Set<IFieldType>(['average', 'count', 'sum'])

export const isAggregate = (type: IFieldType): boolean => isAggregateFieldType.has(type)

const notFilterableFieldType: Set<IFieldType> = new Set<IFieldType>(['lookup', 'reference'])

export const isFilterable = (type: IFieldType): boolean => !notFilterableFieldType.has(type)
