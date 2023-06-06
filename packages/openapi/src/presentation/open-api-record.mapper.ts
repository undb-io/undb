import type {
  CollaboratorField,
  Field,
  IFieldType,
  IQueryRecordSchema,
  MultiSelectField,
  SelectField,
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
    reference: getValue,
    tree: getValue,
    parent: getValue,
    rating: getValue,
    currency: getValue,
    count: getValue,
    lookup: getValue,
    sum: getValue,
    average: getValue,
    attachment: getValue,
    collaborator: (field) => {
      const values = (field as CollaboratorField).getDisplayValues(displayValues)
      const userIds = getValue(field) as string[]
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
