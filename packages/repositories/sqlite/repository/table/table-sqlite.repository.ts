import type { ITableRepository, ITableSpec, Table } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import {
  Field as FieldEntity,
  fieldTypeMap,
  Option as OptionEntity,
  OptionColor,
  Table as TableEntity,
} from '../../entity'
import { TableSqliteMapper } from './table-sqlite.mapper'

export class TableSqliteRepository implements ITableRepository {
  constructor(protected readonly em: EntityManager) {}

  async findOneById(id: string): Promise<Option<Table>> {
    const table = await this.em.findOne(TableEntity, id)
    if (!table) return None

    return Some(TableSqliteMapper.entityToDomain(table).unwrap())
  }

  findOne(spec: ITableSpec): Promise<Option<Table>> {
    throw new Error('Method not implemented.')
  }

  find(spec: ITableSpec): Promise<Table[]> {
    throw new Error('Method not implemented.')
  }

  async insert(table: Table): Promise<void> {
    const tableEntity = new TableEntity()
    tableEntity.id = table.id.value
    tableEntity.name = table.name.value

    for (const field of table.schema.fields) {
      const fieldEntiy = new FieldEntity()
      fieldEntiy.id = field.id.value
      fieldEntiy.type = fieldTypeMap[field.type]
      fieldEntiy.name = field.name.value
      fieldEntiy.table = tableEntity
      this.em.persist(fieldEntiy)

      if (field.type === 'select') {
        for (const option of field.options.options) {
          const optionEntity = new OptionEntity()
          optionEntity.id = option.id.value
          optionEntity.name = option.name.value
          optionEntity.field = fieldEntiy

          const optionColor = new OptionColor()
          optionColor.name = option.color.name
          optionColor.shade = option.color.shade
          optionEntity.color = optionColor

          this.em.persist(optionEntity)
        }
      }
    }

    this.em.persist(tableEntity)

    await this.em.flush()
  }

  updateOneById(id: string, spec: ITableSpec): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
