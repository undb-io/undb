import type { ITableSpec, IUnderlyingTableManager, Table } from '@egodb/core'
import { INTERNAL_FIELD_ID_NAME, INTERNAL_FIELD_UPDATED_AT_NAME } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { UnderlyingTableBuilder } from '../entity/underlying-table/underlying-table.builder'
import { UnderlyingTableSqliteManagerVisitor } from './underlying-table-sqlite.manager-visitor'

export class UnderlyingTableSqliteManager implements IUnderlyingTableManager {
  constructor(protected readonly em: EntityManager) {}
  async create(table: Table): Promise<void> {
    const knex = this.em.getKnex()
    const sb = knex.schema
    const tableName = table.id.value

    await sb.createTable(table.id.value, (t) => {
      const builder = new UnderlyingTableBuilder(knex, t, table.id.value)
      builder.createId().createCreatedAt().createUpdatedAt().createUnderlying(table.schema.fields)
    }).raw(`
      CREATE TRIGGER update_at_update_${tableName} AFTER UPDATE ON ${tableName}
      BEGIN
        update ${tableName} SET ${INTERNAL_FIELD_UPDATED_AT_NAME} = datetime('now') WHERE ${INTERNAL_FIELD_ID_NAME} = NEW.${INTERNAL_FIELD_ID_NAME};
      END;
    `)
  }

  async update(table: Table, spec: ITableSpec): Promise<void> {
    const visitor = new UnderlyingTableSqliteManagerVisitor(table, this.em)
    spec.accept(visitor)

    await visitor.commit()
  }

  async delete(table: Table): Promise<void> {
    const knex = this.em.getKnex()

    const sb = knex.schema.dropTable(table.id.value)
    await sb
  }
}
