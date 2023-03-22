import type { Table as CoreTable, IRecordSpec, LookupField, ReferenceFieldTypes } from '@egodb/core'
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
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { UnderlyingSelectColumn } from '../../underlying-table/underlying-column.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceManager } from './record-sqlite.reference-manager.js'
import { RecordSqliteReferenceQueryVisitorHelper } from './record-sqlite.reference-query-visitor.helper.js'
import { TABLE_ALIAS } from './record.constants.js'

export interface IRecordQueryBuilder {
  from(): this
  where(): this
  sort(): this
  looking(): this
  expand(field?: ReferenceFieldTypes): this
  select(): this
  build(): Promisable<this>
}

export class RecordSqliteQueryBuilder implements IRecordQueryBuilder {
  private readonly knex: Knex
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
      const visitor = new RecordSqliteQueryVisitor(this.table.id.value, schema, this.qb, this.knex)

      this.spec.accept(visitor).unwrap()
    }

    return this
  }

  sort(): this {
    const schema = this.table.schema.toIdMap()
    const view = this.table.mustGetView(this.viewId)
    const sorts = view.sorts?.sorts ?? []
    if (sorts.length) {
      for (const sort of sorts) {
        const field = schema.get(sort.fieldId)
        if (!field) continue

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
          if (Array.isArray(column)) {
            for (const c of column) {
              if (c.virtual) continue
              this.qb.orderBy(`${TABLE_ALIAS}.${c.name}`, sort.direction)
            }
          } else if (!column.virtual) {
            this.qb.orderBy(`${TABLE_ALIAS}.${column.name}`, sort.direction)
          }
        }
      }
    }

    return this
  }

  looking(): this {
    new RecordSqliteReferenceManager(this.em, this.knex, this.qb, this.table, this.tableEntity).visit(this.table)
    // new RecordSqliteReferenceQueryVisitorHelper(this.em, this.knex, this.qb).visit(this.table, this.tableEntity)
    return this
  }

  expand(field?: ReferenceFieldTypes | LookupField): this {
    if (field) {
      new RecordSqliteReferenceQueryVisitorHelper(this.em, this.knex, this.qb).expandField(
        field,
        this.table.schema.toIdMap(),
        this.tableEntity,
      )
    }
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
