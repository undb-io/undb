import type { IRecordSpec, ReferenceFieldTypes, Table, TableSchemaIdMap, View } from '@egodb/core'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  ParentField,
} from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { union } from 'lodash-es'
import type { Promisable } from 'type-fest'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor'
import { getFTAlias, TABLE_ALIAS } from './record.constants'
import { expandField } from './record.util'

export interface IRecordQueryBuilder {
  from(): this
  where(): this
  sort(): this
  reference(): this
  expand(field?: ReferenceFieldTypes): this
  select(): this
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
    private readonly table: Table,
    private readonly spec: IRecordSpec | null,
    viewId?: string,
  ) {
    this.knex = em.getKnex()
    this.qb = this.knex.queryBuilder()
    this.view = table.mustGetView(viewId)
    this.schemaMap = table.schema.toIdMap()
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
    const columns = UnderlyingColumnFactory.createMany(fields)

    const names = union(
      columns.map((c) => c.name),
      [INTERNAL_COLUMN_ID_NAME, INTERNAL_COLUMN_CREATED_AT_NAME, INTERNAL_COLUMN_UPDATED_AT_NAME],
    ).map((name) => `${TABLE_ALIAS}.${name}`)

    this.qb.select(names)
    return this
  }

  async build(): Promise<this> {
    await Promise.all(this.#jobs.map((job) => job()))

    return this
  }
}
