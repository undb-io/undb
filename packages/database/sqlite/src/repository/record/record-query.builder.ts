import type { Table as CoreTable, IRecordSpec } from '@egodb/core'
import {
  SelectField as CoreSelectField,
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
} from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { union } from 'lodash-es'
import type { Promisable } from 'type-fest'
import type { Table } from '../../entity/table.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { UnderlyingSelectColumn } from '../../underlying-table/underlying-column.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { TABLE_ALIAS } from './record.constants.js'

export interface IRecordQueryBuilder {
  from(): this
  where(): this
  sort(): this
  reference(): this
  select(): this
  build(): Promisable<this>
}

export class RecordSqliteQueryBuilder implements IRecordQueryBuilder {
  public readonly knex: Knex
  public readonly qb: Knex.QueryBuilder

  constructor(
    private readonly em: EntityManager,
    private readonly table: CoreTable,
    private readonly tableEntity: Table,
    private readonly spec: IRecordSpec | null,
    private readonly viewId?: string,
  ) {
    this.knex = em.getKnex()
    this.qb = this.knex.queryBuilder()
  }

  clone(): RecordSqliteQueryBuilder {
    const view = this.table.mustGetView(this.viewId)
    return new RecordSqliteQueryBuilder(this.em, this.table, this.tableEntity, this.spec, view.id.value)
  }

  from(): this {
    this.qb.from(this.table.id.value)
    return this
  }

  where(): this {
    if (this.spec) {
      const schema = this.table.schema.toIdMap()
      const visitor = new RecordSqliteQueryVisitor(this.table.id.value, schema, this.em, this.qb, this.knex)

      this.spec.accept(visitor).unwrap()
    }

    return this
  }

  sort(): this {
    const view = this.table.mustGetView(this.viewId)
    if (!view.sorts) return this

    const schema = this.table.schema.toIdMap()
    for (const sort of view.sorts) {
      const field = schema.get(sort.fieldId)
      if (!field) continue
      if (!field.sortable) continue

      if (field instanceof CoreSelectField) {
        const column = new UnderlyingSelectColumn(field, this.table.id.value)
        const order = sort.direction === 'asc' ? field.options.options : [...field.options.options].reverse()
        this.qb.orderByRaw(`
            CASE ${TABLE_ALIAS}.${column.name}
              ${order.map((option, index) => `WHEN '${option.key.value}' THEN ${index} `).join('\n')}
              ELSE ${sort.direction === 'asc' ? -1 : order.length}
            END
          `)
      } else {
        const column = UnderlyingColumnFactory.create(field, this.table.id.value)
        const getName = (column: IUnderlyingColumn) => (column.virtual ? column.name : `${TABLE_ALIAS}.${column.name}`)
        if (Array.isArray(column)) {
          for (const c of column) {
            this.qb.orderBy(getName(c), sort.direction)
          }
        } else {
          this.qb.orderBy(getName(column), sort.direction)
        }
      }
    }

    return this
  }

  reference(): this {
    new RecordSqliteReferenceQueryVisitor(this.em, this.knex, this.qb, this.table, this.tableEntity).visit(this.table)
    return this
  }

  select(): this {
    const schema = this.table.schema
    const view = this.table.mustGetView(this.viewId)
    const fields = view.getVisibleFields(schema.fields)
    const columns = UnderlyingColumnFactory.createMany(fields, this.table.id.value)

    const names = union(
      columns.filter((c) => !c.virtual).map((c) => c.name),
      [INTERNAL_COLUMN_ID_NAME, INTERNAL_COLUMN_CREATED_AT_NAME, INTERNAL_COLUMN_UPDATED_AT_NAME],
    ).map((name) => `${TABLE_ALIAS}.${name}`)

    this.qb.select(names)

    return this
  }

  build(): this {
    return this
  }
}
