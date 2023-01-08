import type { ITableRepository, ITableSpec, Table } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { Field as FieldEntity, fieldTypeMap, Table as TableEntity } from '../../entity'

export class TableSqliteRepository implements ITableRepository {
  constructor(protected readonly em: EntityManager) {}

  async findOneById(id: string): Promise<Option<Table>> {
    const table = await this.em.findOne(TableEntity, id)

    throw new Error('Method not implemented.')
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
    }

    this.em.persist(tableEntity)

    await this.em.flush()
  }

  updateOneById(id: string, spec: ITableSpec): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
