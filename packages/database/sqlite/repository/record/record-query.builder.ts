import type { IRecordSpec, ReferenceFieldTypes, Table, TableSchemaIdMap, View } from '@egodb/core'
import {
  getReferenceFields,
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
} from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { union } from 'lodash-es'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor'
import { TABLE_ALIAS } from './record.constants'
import { expandField } from './record.util'

export interface IRecordQueryBuilder {
  from(): this
  where(): this
  sort(): this
  reference(): this
  expand(field?: ReferenceFieldTypes): this
  select(): this
  build(): Knex.QueryBuilder
}

export class RecordSqliteQueryBuilder implements IRecordQueryBuilder {
  private readonly view: View
  private readonly schema: TableSchemaIdMap
  private readonly qb: Knex.QueryBuilder

  constructor(
    private readonly knex: Knex,
    private readonly table: Table,
    private readonly spec: IRecordSpec | null,
    viewId?: string,
  ) {
    this.qb = knex.queryBuilder()
    this.view = table.mustGetView(viewId)
    this.schema = table.schema.toIdMap()
  }

  from(): this {
    this.qb.from(this.table.id.value)
    return this
  }

  where(): this {
    if (this.spec) {
      const visitor = new RecordSqliteQueryVisitor(this.table.id.value, this.schema, this.qb, this.knex)

      this.spec.accept(visitor).unwrap()
    }

    return this
  }

  sort(): this {
    const sorts = this.view.sorts?.sorts ?? []
    if (sorts.length) {
      for (const sort of sorts) {
        const field = this.schema.get(sort.fieldId)
        if (!field) continue

        const column = UnderlyingColumnFactory.create(field)
        if (Array.isArray(column)) {
          for (const c of column) {
            this.qb.orderBy(`${TABLE_ALIAS}.${c.name}`, sort.direction)
          }
        } else {
          this.qb.orderBy(`${TABLE_ALIAS}.${column.name}`, sort.direction)
        }
      }
    }

    return this
  }

  reference(): this {
    const referenceFields = getReferenceFields([...this.schema.values()])
    for (const [index, referenceField] of referenceFields.entries()) {
      const visitor = new RecordSqliteReferenceQueryVisitor(this.table.id.value, index, this.qb, this.knex)
      referenceField.accept(visitor)
    }
    return this
  }
  expand(field?: ReferenceFieldTypes): this {
    if (field) {
      expandField(field, TABLE_ALIAS, this.knex, this.qb, true)
    }
    return this
  }
  select(): this {
    const fields = this.view.getVisibleFields([...this.schema.values()])
    const columns = UnderlyingColumnFactory.createMany(fields)

    const names = union(
      columns.map((c) => `${TABLE_ALIAS}.${c.name}`),
      // always return internal fields
      [INTERNAL_COLUMN_ID_NAME, INTERNAL_COLUMN_CREATED_AT_NAME, INTERNAL_COLUMN_UPDATED_AT_NAME].map(
        (name) => `${TABLE_ALIAS}.${name}`,
      ),
    )
    this.qb.select(names)
    return this
  }
  build(): Knex.QueryBuilder {
    return this.qb
  }
}
