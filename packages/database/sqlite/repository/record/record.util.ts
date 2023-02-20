import type { IQueryTreeRecords, IReference, ReferenceFieldTypes } from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { isEmpty } from 'lodash-es'
import type { ExpandColumnName, RecordSqliteWithParent } from './record.type.js'

export const createRecordTree = <T extends RecordSqliteWithParent>(dataset: T[]): IQueryTreeRecords => {
  const hashTable = Object.create(null)
  dataset.forEach((aData) => (hashTable[aData.id] = { ...aData, children: [] }))
  const dataTree: IQueryTreeRecords = []
  dataset.forEach((aData) => {
    if (aData.parent_id) hashTable[aData.parent_id].children.push(hashTable[aData.id])
    else dataTree.push(hashTable[aData.id])
  })
  return dataTree
}

export const INTERNAL_COLUMN_EXPAND_NAME = 'expand'

export const isExpandColumnName = (str: string): str is ExpandColumnName => str.endsWith(INTERNAL_COLUMN_EXPAND_NAME)

export const getExpandColumnName = (fieldId: string): ExpandColumnName => `${fieldId}_expand`

export const getFieldIdFromExpand = (expand: ExpandColumnName): string => expand.split('_expand')[0]

export const getDisplayFieldIds = (field: IReference): string[] => {
  const ids = field.displayFieldIds.map((fieldId) => fieldId.value)

  if (isEmpty(ids)) {
    return [INTERNAL_COLUMN_ID_NAME]
  }

  return ids
}

export const expandField = (
  field: ReferenceFieldTypes,
  table: string,
  knex: Knex,
  qb: Knex.QueryBuilder,
  multiple = false,
): void => {
  const jsonObjectEntries: [string, string][] = getDisplayFieldIds(field).map((fieldId) => [
    `'${fieldId}'`,
    multiple ? `json_group_array(${table}.${fieldId})` : `${table}.${fieldId}`,
  ])

  qb.groupBy(`${table}.${INTERNAL_COLUMN_ID_NAME}`).select(
    knex.raw(
      `json_object('${field.id.value}',json_object(${jsonObjectEntries
        .map((k) => k.join(','))
        .join(',')})) as ${getExpandColumnName(field.id.value)}`,
    ),
  )
}
