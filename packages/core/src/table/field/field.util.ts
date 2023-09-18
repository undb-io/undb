import type { TFunction } from 'i18next'
import { castArray, isBoolean, isNumber, isPlainObject, isString, uniq } from 'lodash-es'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { Options } from '../option'
import type { Field, ICreateFieldSchema, IFieldType, SelectFieldTypes } from './field.type'
import type { ICreateSelectFieldSchema } from './fields/select/select-field.type'

const controlledFieldTypes: Set<IFieldType> = new Set([
  'id',
  'auto-increment',
  'created-at',
  'updated-at',
  'created-by',
  'updated-by',
  'qrcode',
  'count',
  'sum',
  'average',
  'lookup',
  'min',
  'max',
])

export const isControlledFieldType = (type: IFieldType): boolean => controlledFieldTypes.has(type)

const displayFieldTypes: Set<IFieldType> = new Set<IFieldType>([
  'auto-increment',
  'color',
  'date',
  'email',
  'url',
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
  'min',
  'max',
])

export const isNumeric = (type: IFieldType): boolean => isNumericFieldType.has(type)

export const isAggregateFieldType: Set<IFieldType> = new Set<IFieldType>(['average', 'count', 'sum', 'min', 'max'])

export const isAggregate = (type: IFieldType): boolean => isAggregateFieldType.has(type)

const notFilterableFieldType: Set<IFieldType> = new Set<IFieldType>(['lookup', 'reference', 'qrcode'])

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

export const searchableFieldTypes = new Set<IFieldType>(['string', 'email', 'number', 'currency'])

export const isSearchable = (type: IFieldType) => searchableFieldTypes.has(type)

export const canDuplicate = (type: IFieldType) => !cannotDuplicate.has(type)

export type FieldTypeConvertStrategy = 'clear' | 'match' | 'cast' | 'ignore'

export const fieldTypeConvertMap: Partial<Record<IFieldType, Partial<Record<IFieldType, FieldTypeConvertStrategy>>>> = {
  string: {
    color: 'ignore',
    email: 'ignore',
    url: 'cast',
    json: 'cast',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  number: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    email: 'clear',
    url: 'clear',
    json: 'cast',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  currency: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    email: 'clear',
    url: 'clear',
    json: 'cast',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  rating: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    email: 'clear',
    url: 'clear',
    json: 'cast',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  color: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    json: 'cast',
    url: 'clear',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  email: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    date: 'clear',
    json: 'cast',
    url: 'clear',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  url: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    date: 'clear',
    json: 'cast',
    number: 'clear',
    email: 'clear',
    select: 'clear',
    'multi-select': 'clear',
    bool: 'cast',
    rating: 'clear',
    'date-range': 'clear',
    currency: 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  json: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    url: 'clear',
    date: 'clear',
    email: 'clear',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  bool: {
    string: 'clear',
    attachment: 'clear',
    color: 'clear',
    date: 'clear',
    url: 'clear',
    number: 'cast',
    select: 'clear',
    email: 'clear',
    json: 'cast',
    'multi-select': 'clear',
    'date-range': 'clear',
    rating: 'clear',
    currency: 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  attachment: {
    string: 'cast',
    attachment: 'clear',
    color: 'clear',
    date: 'clear',
    url: 'clear',
    number: 'clear',
    select: 'clear',
    email: 'clear',
    json: 'clear',
    'date-range': 'clear',
    'multi-select': 'clear',
    rating: 'clear',
    currency: 'clear',
    bool: 'clear',
    collaborator: 'clear',
    count: 'ignore',
    average: 'ignore',
    sum: 'ignore',
    reference: 'clear',
    qrcode: 'ignore',
    lookup: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  date: {
    string: 'clear',
    attachment: 'clear',
    email: 'clear',
    json: 'cast',
    url: 'clear',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  'date-range': {
    string: 'clear',
    attachment: 'clear',
    email: 'clear',
    json: 'cast',
    url: 'clear',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  'multi-select': {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    json: 'clear',
    url: 'clear',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  select: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    url: 'clear',
    json: 'clear',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  collaborator: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    json: 'cast',
    url: 'clear',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  count: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    url: 'clear',
    json: 'cast',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  sum: {
    string: 'cast',
    attachment: 'clear',
    url: 'clear',
    email: 'clear',
    json: 'cast',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  average: {
    string: 'cast',
    attachment: 'clear',
    url: 'clear',
    email: 'clear',
    json: 'cast',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  lookup: {
    string: 'cast',
    attachment: 'clear',
    url: 'clear',
    email: 'clear',
    json: 'clear',
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
    reference: 'clear',
    qrcode: 'ignore',
    min: 'ignore',
    max: 'ignore',
  },
  min: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    url: 'clear',
    json: 'cast',
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
    reference: 'clear',
    qrcode: 'ignore',
    count: 'ignore',
    max: 'ignore',
  },
  max: {
    string: 'cast',
    attachment: 'clear',
    email: 'clear',
    url: 'clear',
    json: 'cast',
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
    reference: 'clear',
    qrcode: 'ignore',
    count: 'ignore',
    min: 'ignore',
  },
  qrcode: {
    string: 'clear',
    attachment: 'clear',
    email: 'clear',
    url: 'clear',
    json: 'clear',
    color: 'clear',
    date: 'clear',
    number: 'clear',
    'date-range': 'clear',
    select: 'clear',
    bool: 'clear',
    rating: 'clear',
    'multi-select': 'clear',
    currency: 'clear',
    collaborator: 'clear',
    average: 'ignore',
    sum: 'ignore',
    lookup: 'ignore',
    reference: 'clear',
    qrcode: 'ignore',
    count: 'ignore',
    min: 'ignore',
    max: 'ignore',
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

function isNumberValue(value: string | number | null): boolean {
  return match(value)
    .returnType<boolean>()
    .when(isNumber, () => true)
    .when(isString, (v) => /^-?\d+$/.test(v))
    .otherwise(() => false)
}

function isDateValue(value: string | number | null): boolean {
  if (typeof value === 'string') {
    const timestamp = Date.parse(value)
    return !isNaN(timestamp)
  }
  return false
}

function isEmailValue(value: string | number | null): boolean {
  if (typeof value === 'string') {
    return z.string().email().safeParse(value).success
  }
  return false
}

function isUrlValue(value: string | number | null): boolean {
  if (typeof value === 'string') {
    return z.string().url().safeParse(value).success
  }
  return false
}

function isJsonValue(value: string | number | null | object): boolean {
  return isPlainObject(value)
}

export const inferFieldType = (
  values: (string | number | null | object | boolean)[],
): Omit<ICreateFieldSchema, 'name'> => {
  const distinctValues = uniq(values)
    .map((s) => (isString(s) ? s.trim() : s))
    .filter(Boolean) as (string | number)[]

  return match(distinctValues)
    .returnType<Omit<ICreateFieldSchema, 'name'>>()
    .when(
      (distinctValues) => distinctValues.every(isBoolean),
      () => ({ type: 'bool' }),
    )
    .when(
      (distinctValues) => distinctValues.every(isNumberValue),
      () => ({ type: 'number' }),
    )
    .when(
      (distinctValues) => distinctValues.every(isDateValue),
      () => ({ type: 'date' }),
    )
    .when(
      (distinctValues) => distinctValues.every(isEmailValue),
      () => ({ type: 'email' }),
    )
    .when(
      (distinctValues) => distinctValues.every(isUrlValue),
      () => ({ type: 'url' }),
    )
    .when(
      (distinctValues) => distinctValues.some(isJsonValue),
      () => ({ type: 'json' }),
    )
    .when(
      (distinctValues) => {
        const distinctValuesCount = distinctValues.length
        const valuesCount = values.length
        return distinctValuesCount / valuesCount < 0.5 && valuesCount > 10 && distinctValuesCount < 100
      },
      () =>
        ({
          type: 'select',
          options: Options.create(distinctValues.map((value) => ({ name: value?.toString() ?? '' }))).options.map((o) =>
            o.toJSON(),
          ),
        }) as Omit<ICreateSelectFieldSchema, 'name'>,
    )
    .otherwise(() => ({ type: 'string' }))
}

export const castFieldValue = (type: IFieldType, value: string | number | null | object | boolean) => {
  return match(type)
    .with('number', () => {
      if (isNumber(value)) return value
      return value ? Number(value) : null
    })
    .with('bool', () =>
      match(value)
        .returnType<boolean>()
        .with(['true', 'TRUE'], () => true)
        .with(['false', 'FALSE'], () => false)
        .otherwise(Boolean),
    )
    .with('select', () => value || null)
    .with('multi-select', 'reference', 'tree', 'collaborator', () => (value ? castArray(value) : null))
    .otherwise(() => value)
}
