/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  CollaboratorField,
  Field,
  IFieldType,
  IQueryRecordSchema,
  LookupField,
  MultiSelectField,
  ParentField,
  ReferenceField,
  SelectField,
  TreeField,
} from '@undb/core'
import { zipObject } from 'lodash-es'

export const openApiRecordValueMapper = (
  record?: IQueryRecordSchema,
): globalThis.Record<IFieldType, (field: Field) => any> => {
  const getValue = (field: Field) => record?.values?.[field.id.value]
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

export type IOpenApiRecordValueMapper = typeof openApiRecordValueMapper

export const openApiRecordMapper = (fields: Field[], record: IQueryRecordSchema) => {
  const result: Record<string, any> = {}
  for (const field of fields) {
    const mapper = openApiRecordValueMapper(record)
    const value = mapper[field.type](field)

    result[field.name.value] = value
  }

  return result
}

export type IOpenApiRecordMapper = typeof openApiRecordMapper
