import type { TFunction } from 'i18next'
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
    attachment: 'clear',
    'date-range': 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  number: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    email: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    rating: 'cast',
    currency: 'cast',
    collaborator: 'clear',
    date: 'cast',
    'date-range': 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  currency: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    email: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    rating: 'cast',
    number: 'cast',
    collaborator: 'clear',
    date: 'clear',
    'date-range': 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  rating: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    email: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    currency: 'cast',
    number: 'cast',
    collaborator: 'clear',
    date: 'clear',
    'date-range': 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  color: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    date: 'clear',
    number: 'clear',
    select: 'cast',
    'multi-select': 'cast',
    bool: 'cast',
    rating: 'clear',
    currency: 'clear',
    'date-range': 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  email: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    rating: 'clear',
    'date-range': 'clear',
    currency: 'clear',
    collaborator: 'match',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  bool: {
    string: 'clear',
    attachment: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'cast',
    select: 'clear',
    email: 'clear',
    'multi-select': 'clear',
    'date-range': 'clear',
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
    attachment: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    select: 'clear',
    email: 'clear',
    'date-range': 'clear',
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
    attachment: 'clear',
    email: 'clear',
    number: 'clear',
    select: 'clear',
    'date-range': 'clear',
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
  'date-range': {
    string: 'clear',
    attachment: 'clear',
    email: 'clear',
    number: 'clear',
    select: 'clear',
    date: 'cast',
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
    attachment: 'clear',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    'date-range': 'clear',
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
    attachment: 'clear',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    'date-range': 'clear',
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
    attachment: 'clear',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    'date-range': 'clear',
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
  count: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'cast',
    'date-range': 'clear',
    select: 'clear',
    bool: 'cast',
    rating: 'cast',
    'multi-select': 'clear',
    currency: 'cast',
    collaborator: 'clear',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
  },
  sum: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'cast',
    'date-range': 'clear',
    select: 'clear',
    bool: 'cast',
    rating: 'cast',
    'multi-select': 'clear',
    currency: 'cast',
    collaborator: 'clear',
    average: 'ignore',
    count: 'ignore',
    lookup: 'ignore',
  },
  average: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'cast',
    'date-range': 'clear',
    select: 'clear',
    bool: 'cast',
    rating: 'cast',
    'multi-select': 'clear',
    currency: 'cast',
    collaborator: 'clear',
    sum: 'ignore',
    count: 'ignore',
    lookup: 'ignore',
  },
  lookup: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    'date-range': 'clear',
    select: 'clear',
    bool: 'cast',
    rating: 'clear',
    'multi-select': 'clear',
    currency: 'clear',
    collaborator: 'clear',
    sum: 'ignore',
    count: 'ignore',
    average: 'ignore',
  },
}

export const canChangeType = (type: IFieldType) => !!fieldTypeConvertMap[type]

export const changeFieldTypeStrategy = (fromType: IFieldType) => (type: IFieldType) =>
  fieldTypeConvertMap[fromType]?.[type]

export const getNextFieldName = (fieldNames: string[] = [], fieldName?: string): string => {
  if (!fieldName) return `Field (${fieldNames.length + 1})`
  const found = fieldNames.find((n) => n === fieldName)
  if (!found) {
    return fieldName
  }
  const newName = fieldName + ' (1)'
  return getNextFieldName(fieldNames, newName)
}

export const getNamesWithInternals = (fieldNames: string[], t: TFunction, lng?: string): string[] => [
  'id',
  t('created-at', { lng }),
  t('created-by', { lng }),
  t('updated-at', { lng }),
  t('updated-by', { lng }),
  ...fieldNames,
]

export const getFieldNames = (fieldNames: string[], t: TFunction, lng?: string): string[] => {
  const names = getNamesWithInternals(fieldNames, t, lng)

  return fieldNames.map((name, index) =>
    getNextFieldName(names.slice(0, index + names.length - fieldNames.length), name),
  )
}
