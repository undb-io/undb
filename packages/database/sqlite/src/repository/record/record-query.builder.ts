import type { IRecordSpec, ReferenceFieldTypes, Table as CoreTable, TableSchemaIdMap, View } from '@egodb/core'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  ParentField,
  SelectField as CoreSelectField,
} from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { union } from 'lodash-es'
import type { Promisable } from 'type-fest'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { UnderlyingSelectColumn } from '../../underlying-table/underlying-column.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { getFTAlias, INTERNAL_COLUMN_NAME_TOTAL, TABLE_ALIAS } from './record.constants.js'
import { expandField } from './record.util.js'

export interface IRecordQueryBuilder {
  from(): this
  where(): this
  sort(): this
  reference(): this
  expand(field?: ReferenceFieldTypes): this
  select(): this
  count(): this
  build(): Promisable<this>
}

export class RecordSqliteQueryBuilder implements IRecordQueryBuilder {
  private readonly view: View
  private readonly schemaMap: TableSchemaIdMap
  private readonly knex: Knex
  public readonly qb: Knex.QueryBuilder

  #jobs: (() => Promise<void>)[] = []

  constructor(
    private readonly em: EntityManager,
    private readonly table: CoreTable,
    private readonly spec: IRecordSpec | null,
    viewId?: string,
  ) {
    this.knex = em.getKnex()
    this.qb = this.knex.queryBuilder()
    this.view = table.mustGetView(viewId)
    this.schemaMap = table.schema.toIdMap()
  }

  clone(): RecordSqliteQueryBuilder {
    return new RecordSqliteQueryBuilder(this.em, this.table, this.spec, this.view.id.value)
  }

  from(): this {
    this.qb.from(this.table.id.value)
    return this
  }

  where(): this {
    if (this.spec) {
      const visitor = new RecordSqliteQueryVisitor(this.table.id.value, this.schemaMap, this.qb, this.knex)

      this.spec.accept(visitor).unwrap()
    }

    return this
  }

  sort(): this {
    const sorts = this.view.sorts?.sorts ?? []
    if (sorts.length) {
      for (const sort of sorts) {
        const field = this.schemaMap.get(sort.fieldId)
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

  reference(): this {
    this.#jobs.push(async () => {
      const referenceFields = this.table.schema.getReferenceFields()
      for (const [index, referenceField] of referenceFields.entries()) {
        const visitor = new RecordSqliteReferenceQueryVisitor(this.table.id.value, index, this.qb, this.knex)
        referenceField.accept(visitor)

        await expandField(
          referenceField,
          getFTAlias(index),
          this.em,
          this.knex,
          this.qb,
          !(referenceField instanceof ParentField),
        )
      }
    })
    return this
  }

  expand(field?: ReferenceFieldTypes): this {
    if (field) {
      this.#jobs.push(async () => {
        await expandField(field, TABLE_ALIAS, this.em, this.knex, this.qb, true)
      })
    }
    return this
  }

  select(): this {
    const fields = this.view.getVisibleFields([...this.schemaMap.values()])
    const columns = UnderlyingColumnFactory.createMany(fields, this.table.id.value)

    const names = union(
      columns.filter((c) => !c.virtual).map((c) => c.name),
      [INTERNAL_COLUMN_ID_NAME, INTERNAL_COLUMN_CREATED_AT_NAME, INTERNAL_COLUMN_UPDATED_AT_NAME],
    ).map((name) => `${TABLE_ALIAS}.${name}`)

    this.qb.select(names)
    return this
  }

  count(): this {
    this.qb.count(`id AS ${INTERNAL_COLUMN_NAME_TOTAL}`)
    return this
  }

  async build(): Promise<this> {
    await Promise.all(this.#jobs.map((job) => job()))

    return this
  }
}
