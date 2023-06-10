import type { ITableSpec, Table } from '@undb/core'
import type { Table as TableEntity } from '../entity/table.js'
import { BaseEntityManager } from '../repository/base-entity-manager.js'
import { RecordSqliteReferenceDeleteVisitor } from '../repository/record/record-sqlite.reference-delete-visitor.js'
import { UnderlyingTableSqliteManagerVisitor } from './underlying-table-sqlite.manager-visitor.js'
import { UnderlyingTableBuilder } from './underlying-table.builder.js'

export interface IUnderlyingTableManager {
  create(table: Table): Promise<void>
  update(tableId: string, spec: ITableSpec): Promise<void>
  delete(tableId: string): Promise<void>
  deleteRecord(table: TableEntity, id: string): Promise<void>
}

export class UnderlyingTableSqliteManager extends BaseEntityManager implements IUnderlyingTableManager {
  async create(table: Table): Promise<void> {
    const queries = new UnderlyingTableBuilder(this.em).createTable(table).build()

    for (const query of queries) {
      await this.em.execute(query)
    }
  }

  async update(tableId: string, spec: ITableSpec): Promise<void> {
    const visitor = new UnderlyingTableSqliteManagerVisitor(tableId, this.em)
    spec.accept(visitor)

    await visitor.commit()
  }

  async delete(tableId: string): Promise<void> {
    // TODO: drop table later
    // const knex = this.em.getKnex()
    // const sb = knex.schema.dropTable(tableId)
    // await this.em.execute(sb.toQuery())
  }

  async deleteRecord(table: TableEntity, id: string): Promise<void> {
    const referenceFields = table.referencedBy.getItems(false)
    for (const referenceField of referenceFields) {
      const referenceFieldDomain = referenceField.toDomain()
      const visitor = new RecordSqliteReferenceDeleteVisitor(this.em, referenceField.table.id, id)
      referenceFieldDomain.accept(visitor)
      await visitor.commit()
    }
  }
}
