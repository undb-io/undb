import type { Table as CoreTable, ITableRepository, ITableSpec } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { Table, Table as TableEntity } from '../../entity/index.js'
import { View as ViewEntity } from '../../entity/view.js'
import type { IUnderlyingTableManager } from '../../underlying-table/underlying-table-sqlite.manager.js'
import { TableSqliteFieldVisitor } from './table-sqlite-field.visitor.js'
import { TableSqliteMapper } from './table-sqlite.mapper.js'
import { TableSqliteMutationVisitor } from './table-sqlite.mutation-visitor.js'

export class TableSqliteRepository implements ITableRepository {
  constructor(protected readonly em: EntityManager, protected readonly tm: IUnderlyingTableManager) {}

  async findOneById(id: string): Promise<Option<CoreTable>> {
    const table = await this.em.findOne(TableEntity, id, {
      populate: ['fields.options', 'views', 'fields.displayFields'],
    })
    if (!table) return None

    return Some(TableSqliteMapper.entityToDomain(table).unwrap())
  }

  findOne(spec: ITableSpec): Promise<Option<CoreTable>> {
    throw new Error('Method not implemented.')
  }

  find(spec: ITableSpec): Promise<CoreTable[]> {
    throw new Error('Method not implemented.')
  }

  async insert(table: CoreTable): Promise<void> {
    await this.em.transactional(async (em) => {
      await this.tm.create(table)

      const tableEntity = new TableEntity(table)

      for (const field of table.schema.fields) {
        const visitor = new TableSqliteFieldVisitor(tableEntity, em)
        field.accept(visitor)
        await visitor.commit()
      }

      for (const view of table.views.views ?? []) {
        const viewEntity = new ViewEntity(tableEntity, view)
        em.persist(viewEntity)
      }

      em.persist(tableEntity)
    })
  }

  async updateOneById(id: string, spec: ITableSpec): Promise<void> {
    await this.em.transactional(async (em) => {
      const visitor = new TableSqliteMutationVisitor(id, em)

      spec.accept(visitor)

      await visitor.commit()
      await this.tm.update(id, spec)
    })
  }

  async deleteOneById(id: string): Promise<void> {
    await this.em.transactional(async (em) => {
      await em.qb(Table).update({ deletedAt: new Date() }).where({ id })
      await this.tm.delete(id)
    })
  }
}
