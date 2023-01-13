import type { ITableSpec, IUnderlyingTableManager, Table } from '@egodb/core'
import { INTERNAL_FIELD_ID_NAME, INTERNAL_FIELD_UPDATED_AT_NAME } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { UnderlyingTableBuilder } from '../entity/underlying-table/underlying-table.builder'
import { UnderlyingTableSqliteManagerVisitor } from './underlying-table-sqlite.manager-visitor'

export class UnderlyingTableSqliteManager implements IUnderlyingTableManager {
  constructor(protected readonly em: EntityManager) {}
  async create(table: Table): Promise<void> {
    const knex = this.em.getKnex()
    const tableName = table.id.value

    const query = knex.schema
      .createTable(table.id.value, (t) => {
        const builder = new UnderlyingTableBuilder(knex, t, table.id.value)
        builder.createId().createCreatedAt().createUpdatedAt().createUnderlying(table.schema.fields)
      })
      .toQuery()

    await this.em.execute(query)

    const raw = knex.schema
      .raw(
        `
      CREATE TRIGGER update_at_update_${tableName} AFTER UPDATE ON ${tableName}
      BEGIN
        update ${tableName} SET ${INTERNAL_FIELD_UPDATED_AT_NAME} = datetime('now') WHERE ${INTERNAL_FIELD_ID_NAME} = NEW.${INTERNAL_FIELD_ID_NAME};
      END;
    `,
      )
      .toQuery()

    await this.em.execute(raw)
  }

  async update(tableId: string, spec: ITableSpec): Promise<void> {
    const visitor = new UnderlyingTableSqliteManagerVisitor(tableId, this.em)
    spec.accept(visitor)

    await visitor.commit()
  }

  async delete(tableId: string): Promise<void> {
    const knex = this.em.getKnex()

    const sb = knex.schema.dropTable(tableId)
    await this.em.execute(sb.toQuery())
  }
}
