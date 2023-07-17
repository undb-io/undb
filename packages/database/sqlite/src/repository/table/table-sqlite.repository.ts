import type { EntityManager } from '@mikro-orm/better-sqlite'
import {
  TableFactory,
  type Table as CoreTable,
  type ITableCache,
  type ITableRepository,
  type ITableSpec,
} from '@undb/core'
import { type IUnitOfWork } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { ReferenceField, Table, Table as TableEntity } from '../../entity/index.js'
import { View as ViewEntity } from '../../entity/view.js'
import { UnderlyingTableSqliteManager } from '../../underlying-table/underlying-table-sqlite.manager.js'
import { TableSqliteFieldVisitor } from './table-sqlite-field.visitor.js'
import { TableSqliteMapper } from './table-sqlite.mapper.js'
import { TableSqliteMutationVisitor } from './table-sqlite.mutation-visitor.js'

export class TableSqliteRepository implements ITableRepository {
  constructor(protected readonly uow: IUnitOfWork<EntityManager>, protected readonly cache: ITableCache) {}

  private get em() {
    return this.uow.conn()
  }

  async findOneById(id: string): Promise<Option<CoreTable>> {
    const cached = await this.cache.get(id)
    if (cached) {
      const table = TableFactory.fromQuery(cached)
      return Some(table)
    }

    const table = await this.em.findOne(TableEntity, id, {
      populate: [
        'fields.options',
        'views',
        'forms',
        'fields.displayFields',
        'fields.foreignTable',
        'fields',
        'views.widgets.visualization',
      ],
    })
    if (!table) return None

    for (const field of table.fields) {
      if (field instanceof ReferenceField) {
        if (!field.foreignTable?.fields.isInitialized()) {
          await field.foreignTable?.fields.init()
        }
      }
    }

    await this.cache.set(table.id, TableSqliteMapper.entityToQuery(table))

    return Some(TableSqliteMapper.entityToDomain(table).unwrap())
  }

  findOne(spec: ITableSpec): Promise<Option<CoreTable>> {
    throw new Error('Method not implemented.')
  }

  find(spec: ITableSpec): Promise<CoreTable[]> {
    throw new Error('Method not implemented.')
  }

  async insert(table: CoreTable): Promise<void> {
    const em = this.em
    const tm = new UnderlyingTableSqliteManager(em)
    await tm.create(table)

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
  }

  async updateOneById(id: string, spec: ITableSpec): Promise<void> {
    await this.cache.remove(id)
    const em = this.em
    await em.transactional(async (em) => {
      const visitor = new TableSqliteMutationVisitor(id, em)

      spec.accept(visitor)

      await visitor.commit()
      const tm = new UnderlyingTableSqliteManager(em)
      await tm.update(id, spec)
    })
  }

  async deleteOneById(id: string): Promise<void> {
    await this.cache.remove(id)

    await this.em.transactional(async (em) => {
      await em.qb(Table).update({ deletedAt: new Date() }).where({ id })
      const tm = new UnderlyingTableSqliteManager(em)
      await tm.delete(id)
    })
  }
}
