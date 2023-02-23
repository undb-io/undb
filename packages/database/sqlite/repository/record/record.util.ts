import type { IQueryTreeRecords, ReferenceFieldTypes } from '@egodb/core'
import { FieldFactory } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { Field } from '../../entity/field.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
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

// TODO: 如果 core table service 可以获取完整的 table 和其关联的 fields 那在这个函数里可以不用查询 displayFields
export const expandField = async (
  field: ReferenceFieldTypes,
  table: string,
  em: EntityManager,
  knex: Knex,
  qb: Knex.QueryBuilder,
  multiple = false,
): Promise<void> => {
  const jsonObjectEntries: [string, string][] = []

  const displayFieldIds = field.displayFieldIds.map((id) => id.value)
  for (const fieldId of displayFieldIds) {
    const field = await em.findOne(Field, { id: fieldId })
    if (!field) continue

    const key = `'${fieldId}'`

    let name = key
    const f = FieldFactory.unsafeCreate(TableSqliteMapper.fieldToDomain(field))
    if (f.isSystem()) {
      const c = UnderlyingColumnFactory.create(f) as IUnderlyingColumn
      name = `'${c.name}'`
    }

    jsonObjectEntries.push([key, multiple ? `json_group_array(${table}.${name})` : `${table}.${name}`])
  }

  qb.select(
    knex.raw(
      `json_object('${field.id.value}',json_object(${jsonObjectEntries
        .map((k) => k.join(','))
        .join(',')})) as ${getExpandColumnName(field.id.value)}`,
    ),
  )
}
