/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ZodRawShape, ZodType } from 'zod'

import { zipObject } from 'lodash-es'
import { z } from 'zod'

import type { Field, IFieldType } from '../field/field.type.js'
import type { LookupField } from '../field/fields/lookup/lookup-field.js'
import type { MultiSelectField } from '../field/fields/multi-select/multi-select-field.js'
import type { ParentField } from '../field/fields/parent/parent-field.js'
import type { SelectField } from '../field/fields/select/select-field.js'
import type { TreeField } from '../field/fields/tree/tree-field.js'
import type { CollaboratorField, IReferenceReadableValueSchema } from '../field/index.js'
import type { Table } from '../table.js'
import type { Record } from './record.js'

import { multiSelectReadableValueSchema } from '../field/fields/multi-select/multi-select-field.type.js'
import { qrcodeReadableValueSchema } from '../field/fields/qrcode/qrcode-field.type.js'
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
  maxReadableValueSchema,
  minReadableValueSchema,
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

export const recordReadableSchema = z.record(z.any())

// TODO: get value type
export type IRecordReadable = z.infer<typeof recordReadableSchema>

export const recordReadableValueMapper = (record?: Record): globalThis.Record<IFieldType, (field: Field) => any> => {
  const getValue = (field: Field) => record?.values.value.get(field.id.value)?.unpack()
  const displayValues = record?.displayValues?.values
  return {
    attachment: getValue,
    'auto-increment': (field) => record?.autoIncrement,
    average: getValue,
    bool: getValue,
    collaborator: (field) => {
      const userIds = getValue(field) as string[]
      if (!userIds) return []

      const values = (field as CollaboratorField).getDisplayValues(displayValues)
      return values.map((value, index) => ({
        id: userIds[index],
        ...zipObject(['username', 'avatar', 'color'], value),
      }))
    },
    color: getValue,
    count: getValue,
    'created-at': (field) => record?.createdAt.value,
    'created-by': (field) => ({ id: record?.createdBy, ...record?.createdByProfile }),
    currency: getValue,
    date: getValue,
    'date-range': getValue,
    email: getValue,
    id: (field) => record?.id.value,
    json: getValue,
    lookup: (field) => {
      const values = (field as LookupField).getDisplayValues(displayValues)
      return values ?? []
    },
    max: getValue,
    min: getValue,
    'multi-select': (field) => {
      const optionIds = getValue(field) as string[] | undefined
      if (!optionIds?.length) return null

      return optionIds.map((optionId) => ({
        id: optionId,
        name: (field as MultiSelectField).options.getById(optionId).into()?.name.value,
      }))
    },
    number: getValue,
    parent: (field) => {
      const id = getValue(field) as string
      const value = (field as ParentField).getDisplayValues(displayValues)
      if (!value) return null

      return {
        id,
        value: value[0],
      }
    },
    qrcode: getValue,
    rating: getValue,
    reference: (field): IReferenceReadableValueSchema => {
      const ids = getValue(field) as string[]
      if (!ids?.length) return []
      const values = (field as ReferenceField).getDisplayValues(displayValues)
      return values.map((value, index) => ({ id: ids[index], value }))
    },
    select: (field) => {
      const value = getValue(field) as string
      if (!value) return null
      return {
        id: value,
        name: (field as SelectField).options.getById(value).into()?.name.value,
      }
    },
    string: getValue,
    sum: getValue,
    tree: (field) => {
      const ids = getValue(field) as string[]
      if (!ids.length) return []
      const values = (field as TreeField).getDisplayValues(displayValues)
      return values.map((value, index) => ({ id: ids[index], value }))
    },
    'updated-at': (field) => record?.updatedAt.value,
    'updated-by': (field) => ({ id: record?.updatedBy, ...record?.updatedByProfile }),
    url: getValue,
  }
}

export const recordReadableMapper = (fields: Field[], record: Record): IRecordReadable => {
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
  attachment: attachmentReadableValueSchema,
  'auto-increment': autoIncrementReadableValueSchema,
  average: averageReadableValueSchema,
  bool: boolReadableValueSchema,
  collaborator: collaboratorReadableValueSchema,
  color: colorReadableValueSchema,
  count: countReadableValueSchema,
  'created-at': createdAtReadableValueSchema,
  'created-by': createdByReadableValueSchema,
  currency: currencyReadableValueSchema,
  date: dateReadableValueSchema,
  'date-range': dateRangeReadableValueSchema,
  email: emailReadableValueSchema,
  id: idReadableValueSchema,
  // jsonFieldQueryValue is not valid for openapi
  json: jsonReadableValueSchema,
  lookup: lookupReadableValueSchema,
  max: maxReadableValueSchema,
  min: minReadableValueSchema,
  'multi-select': multiSelectReadableValueSchema,
  number: numberReadableValueSchema,
  parent: parentReadableValueSchema,
  qrcode: qrcodeReadableValueSchema,
  rating: ratingReadableValueSchema,
  reference: referenceReadableValueSchema,
  select: selectReadableValueSchema,
  string: stringReadableValueSchema,
  sum: sumReadableValueSchema,
  tree: treeReadableValueSchema,
  'updated-at': updatedAtReadableValueSchema,
  'updated-by': updatedByReadableValueSchema,
  url: urlReadableValueSchema,
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
