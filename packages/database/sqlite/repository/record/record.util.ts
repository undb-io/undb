import type { IQueryTreeRecords } from '@egodb/core'
import type { RecordSqliteWithParent } from './record.type'

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
