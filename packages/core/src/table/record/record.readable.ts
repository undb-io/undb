/* eslint-disable @typescript-eslint/no-unused-vars */
import { zipObject } from 'lodash-es'
import type { ZodRawShape, ZodType } from 'zod'
import { z } from 'zod'
import type { CollaboratorField } from '../field/collaborator-field.js'
import type { Field, IFieldType } from '../field/field.type.js'
import { urlReadableValueSchema } from '../field/fields/url/url-field.type.js'
import {
  attachmentReadableValueSchema,
  autoIncrementReadableValueSchema,
  averageReadableValueSchema,
  boolReadableValueSchema,
  collaboratorReadableValueSchema,
  colorReadableValueSchema,
  countReadableValueSchema,
  createdAtReadableValueSchema,
  createdByReadableValueSchema,
  currencyReadableValueSchema,
  dateRangeReadableValueSchema,
  dateReadableValueSchema,
  emailReadableValueSchema,
  idReadableValueSchema,
  jsonReadableValueSchema,
  lookupReadableValueSchema,
  multiSelectReadableValueSchema,
  numberReadableValueSchema,
  parentReadableValueSchema,
  ratingReadableValueSchema,
  referenceReadableValueSchema,
  selectReadableValueSchema,
  stringReadableValueSchema,
  sumReadableValueSchema,
  treeReadableValueSchema,
  updatedAtReadableValueSchema,
  updatedByReadableValueSchema,
  type ReferenceField,
} from '../field/index.js'
import type { LookupField } from '../field/lookup-field.js'
import type { MultiSelectField } from '../field/multi-select-field.js'
import type { ParentField } from '../field/parent-field.js'
import type { SelectField } from '../field/select-field.js'
import type { TreeField } from '../field/tree-field.js'
import type { Table } from '../table.js'
import type { IQueryRecordSchema } from './record.type.js'

export const recordReadableSchema = z.record(z.any())

// TODO: get value type
export type IRecordReadable = z.infer<typeof recordReadableSchema>

export const recordReadableValueMapper = (
  record?: IQueryRecordSchema,
): globalThis.Record<IFieldType, (field: Field) => any> => {
  const values = record?.values
  const getValue = (field: Field) => values?.[field.id.value]
  const displayValues = record?.displayValues
  return {
    string: getValue,
    number: getValue,
    id: (field) => record?.id,
    'created-at': (field) => record?.createdAt,
    'updated-at': (field) => record?.updatedAt,
    'auto-increment': (field) => record?.autoIncrement,
    color: getValue,
    email: getValue,
    url: getValue,
    json: getValue,
    date: getValue,
    select: (field) => {
      const value = getValue(field) as string
      if (!value) return null
      return {
        id: value,
        name: (field as SelectField).options.getById(value).into()?.name.value,
      }
    },
    'multi-select': (field) => {
      const optionIds = getValue(field) as string[] | undefined
      if (!optionIds?.length) return null

      return optionIds.map((optionId) => ({
        id: optionId,
        name: (field as MultiSelectField).options.getById(optionId).into()?.name.value,
      }))
    },
    bool: getValue,
    'date-range': getValue,
    reference: (field) => {
      const ids = getValue(field) as string[]
      if (!ids) return []
      const values = (field as ReferenceField).getDisplayValues(displayValues)
      return values.map((value, index) => ({ id: ids[index], value }))
    },
    tree: (field) => {
      const ids = getValue(field) as string[]
      if (!ids) return []
      const values = (field as TreeField).getDisplayValues(displayValues)
      return values.map((value, index) => ({ id: ids[index], value }))
    },
    parent: (field) => {
      const id = getValue(field) as string
      const value = (field as ParentField).getDisplayValues(displayValues)
      if (!value) return null

      return {
        id,
        value: value[0],
      }
    },
    rating: getValue,
    currency: getValue,
    count: getValue,
    lookup: (field) => {
      const values = (field as LookupField).getDisplayValues(displayValues)
      return values ?? []
    },
    sum: getValue,
    average: getValue,
    attachment: getValue,
    collaborator: (field) => {
      const userIds = getValue(field) as string[]
      if (!userIds) return []

      const values = (field as CollaboratorField).getDisplayValues(displayValues)
      return values.map((value, index) => ({
        id: userIds[index],
        ...zipObject(['username', 'avatar', 'color'], value),
      }))
    },
    'created-by': (field) => ({ id: record?.createdBy, ...record?.createdByProfile }),
    'updated-by': (field) => ({ id: record?.updatedBy, ...record?.updatedByProfile }),
  }
}

export const recordReadableMapper = (fields: Field[], record: IQueryRecordSchema): IRecordReadable => {
  const result: IRecordReadable = {}
  for (const field of fields) {
    const valueMapper = recordReadableValueMapper(record)
    const value = valueMapper[field.type](field)

    result[field.name.value] = value
  }

  return result
}

export type IRecordReadableMapper = typeof recordReadableMapper

export const recordReadableValueSchemaMap: globalThis.Record<IFieldType, ZodType> = {
  string: stringReadableValueSchema,
  number: numberReadableValueSchema,
  id: idReadableValueSchema,
  'created-at': createdAtReadableValueSchema,
  'updated-at': updatedAtReadableValueSchema,
  'auto-increment': autoIncrementReadableValueSchema,
  color: colorReadableValueSchema,
  email: emailReadableValueSchema,
  url: urlReadableValueSchema,
  // jsonFieldQueryValue is not valid for openapi
  json: jsonReadableValueSchema,
  date: dateReadableValueSchema,
  select: selectReadableValueSchema,
  'multi-select': multiSelectReadableValueSchema,
  bool: boolReadableValueSchema,
  'date-range': dateRangeReadableValueSchema,
  reference: referenceReadableValueSchema,
  tree: treeReadableValueSchema,
  parent: parentReadableValueSchema,
  rating: ratingReadableValueSchema,
  currency: currencyReadableValueSchema,
  count: countReadableValueSchema,
  lookup: lookupReadableValueSchema,
  sum: sumReadableValueSchema,
  average: averageReadableValueSchema,
  attachment: attachmentReadableValueSchema,
  collaborator: collaboratorReadableValueSchema,
  'created-by': createdByReadableValueSchema,
  'updated-by': updatedByReadableValueSchema,
}

export const createRecordReadableValueSchema = (table: Table) => {
  const fields = table.schema.fields

  const shape: ZodRawShape = {}

  for (const field of fields) {
    const valueSchema = recordReadableValueSchemaMap[field.type]
    shape[field.name.value] = valueSchema
  }

  return z.object(shape)
}
