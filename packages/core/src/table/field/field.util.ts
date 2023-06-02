import type { Field, IFieldType, SelectFieldTypes } from './field.type'

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
  'multi-select',
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

export const isSelectFieldType = (field: Field): field is SelectFieldTypes =>
  field.type === 'select' || field.type === 'multi-select'

export const cannotDuplicate: Set<IFieldType> = new Set<IFieldType>([
  'id',
  'created-at',
  'created-by',
  'updated-at',
  'updated-by',
  'auto-increment',
  'parent',
])

export const canDuplicate = (type: IFieldType) => !cannotDuplicate.has(type)

export type FieldTypeConvertStrategy = 'clear' | 'match' | 'cast' | 'ignore'

export const fieldTypeConvertMap: Partial<Record<IFieldType, Partial<Record<IFieldType, FieldTypeConvertStrategy>>>> = {
  string: {
    color: 'ignore',
    email: 'ignore',
    number: 'cast',
    date: 'cast',
    select: 'match',
    'multi-select': 'match',
    bool: 'cast',
    rating: 'cast',
    currency: 'cast',
    collaborator: 'match',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  number: {
    string: 'cast',
    color: 'clear',
    email: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    rating: 'cast',
    currency: 'cast',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  currency: {
    string: 'cast',
    color: 'clear',
    email: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    rating: 'cast',
    number: 'cast',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  rating: {
    string: 'cast',
    color: 'clear',
    email: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    currency: 'cast',
    number: 'cast',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  color: {
    string: 'cast',
    email: 'clear',
    date: 'clear',
    number: 'clear',
    select: 'cast',
    'multi-select': 'cast',
    bool: 'cast',
    rating: 'clear',
    currency: 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  email: {
    string: 'cast',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    rating: 'clear',
    currency: 'clear',
    collaborator: 'match',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  bool: {
    string: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'cast',
    select: 'clear',
    email: 'clear',
    'multi-select': 'clear',
    rating: 'clear',
    currency: 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  attachment: {
    string: 'cast',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    select: 'clear',
    email: 'clear',
    'multi-select': 'clear',
    rating: 'clear',
    currency: 'clear',
    bool: 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  date: {
    string: 'clear',
    email: 'clear',
    date: 'clear',
    number: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    rating: 'clear',
    currency: 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  'multi-select': {
    string: 'cast',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    select: 'match',
    bool: 'cast',
    rating: 'clear',
    currency: 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  select: {
    string: 'cast',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    'multi-select': 'match',
    bool: 'cast',
    rating: 'clear',
    currency: 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  collaborator: {
    string: 'cast',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    select: 'clear',
    bool: 'cast',
    rating: 'clear',
    'multi-select': 'clear',
    currency: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
}

export const canChangeType = (type: IFieldType) => !!fieldTypeConvertMap[type]

export const changeFieldTypeStrategy = (fromType: IFieldType) => (type: IFieldType) =>
  fieldTypeConvertMap[fromType]?.[type]
