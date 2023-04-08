import type { IQueryTreeRecords } from '@undb/core'
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
