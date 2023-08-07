import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { Table as CoreTable, IRecordSpec, TableSchemaIdMap, VisualizationVO } from '@undb/core'
import {
  ChartVisualization,
  SelectField as CoreSelectField,
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
  NumberVisualization,
} from '@undb/core'
import type { IPagination } from '@undb/domain'
import { isNumber, union } from 'lodash-es'
import type { Promisable } from 'type-fest'
import type { Table } from '../../entity/table.js'
import { User } from '../../entity/user.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import {
  INTERNAL_COLUMN_DELETED_BY_NAME,
  INTERNAL_COLUMN_DELETED_BY_PROFILE_NAME,
} from '../../underlying-table/constants.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { UnderlyingSelectColumn } from '../../underlying-table/underlying-column.js'
import { RecordChartGroupVisitor } from './record-chart-group.visitor.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { TABLE_ALIAS } from './record.constants.js'

export interface IRecordQueryBuilder {
  from(): this
  where(includeDeleted: boolean): this
  sort(): this
  reference(): this
  select(...fields: string[]): this
  pagination(pagination?: IPagination): this
  count(): this
  build(): Promisable<this>
}

export class RecordSqliteQueryBuilder implements IRecordQueryBuilder {
  public readonly knex: Knex
  private readonly schema: TableSchemaIdMap

  constructor(
    private readonly em: EntityManager,
    private readonly table: CoreTable,
    private readonly tableEntity: Table,
    private readonly spec: IRecordSpec | null,
    private readonly viewId?: string,
    public readonly qb = em.getKnex().queryBuilder(),
  ) {
    this.knex = em.getKnex()
    this.schema = table.schema.toIdMap()
  }

  clone(): RecordSqliteQueryBuilder {
    const view = this.table.mustGetView(this.viewId)
    return new RecordSqliteQueryBuilder(
      this.em,
      this.table,
      this.tableEntity,
      this.spec,
      view.id.value,
      this.qb.clone(),
    )
  }

  from(): this {
    this.qb.from(this.table.id.value)
    return this
  }

  where(includeDeleted = false): this {
    if (this.spec) {
      const visitor = new RecordSqliteQueryVisitor(
        this.table.id.value,
        this.schema,
        this.em,
        this.qb,
        this.knex,
        includeDeleted,
      )

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
        const column = new UnderlyingSelectColumn(field.id.value, this.table.id.value)
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

  select(..._fields: string[]): this {
    const schema = this.table.schema
    const view = this.table.mustGetView(this.viewId)
    const fields = view.getVisibleFields(schema.fields)
    const columns = UnderlyingColumnFactory.createMany(fields, this.table.id.value)

    const names = union(
      columns.filter((c) => !c.virtual).map((c) => c.name),
      [
        INTERNAL_COLUMN_ID_NAME,
        INTERNAL_COLUMN_CREATED_AT_NAME,
        INTERNAL_COLUMN_CREATED_BY_NAME,
        INTERNAL_COLUMN_UPDATED_AT_NAME,
        INTERNAL_COLUMN_UPDATED_BY_NAME,
        ..._fields.filter((n) => n !== INTERNAL_COLUMN_DELETED_BY_PROFILE_NAME),
      ],
    ).map((name) => `${TABLE_ALIAS}.${name}`)
    if (_fields.includes(INTERNAL_COLUMN_DELETED_BY_PROFILE_NAME)) {
      const {
        properties: { id, avatar, username, color },
        tableName,
      } = this.em.getMetadata().get(User.name)

      const alias = INTERNAL_COLUMN_DELETED_BY_NAME + '_' + tableName

      this.qb
        .select(
          this.knex.raw(
            `json_object(
            '${username.fieldNames[0]}', ${alias}.${username.fieldNames[0]},
            '${avatar.fieldNames[0]}', ${alias}.${avatar.fieldNames[0]},
            '${color.fieldNames[0]}', ${alias}.${color.fieldNames[0]}
          ) as ${INTERNAL_COLUMN_DELETED_BY_PROFILE_NAME}`,
          ),
        )
        .leftJoin(
          `${tableName} as ${alias}`,
          `${alias}.${id.fieldNames[0]}`,
          `${TABLE_ALIAS}.${INTERNAL_COLUMN_DELETED_BY_NAME}`,
        )
    }

    this.qb.select(names).distinct()

    return this
  }

  aggregate(visualization: VisualizationVO): this {
    if (visualization instanceof NumberVisualization) {
      const fieldId = visualization.fieldId?.value
      const numberAggregateFunction = visualization.numberAggregateFunction

      this.from()

      if (!fieldId || !numberAggregateFunction) {
        this.qb.count('* as number')
        return this
      }

      switch (numberAggregateFunction) {
        case 'sum':
          this.qb.sum(`${fieldId} as number`)
          break
        case 'average':
          this.qb.avg(`${fieldId} as number`)
          break
        case 'min':
          this.qb.min(`${fieldId} as number`)
          break
        case 'max':
          this.qb.max(`${fieldId} as number`)
          break
        case 'count':
          this.qb.count(`${fieldId} as number`).whereNotNull(fieldId)
      }
    } else if (visualization instanceof ChartVisualization) {
      const fieldId = visualization.fieldId?.value
      if (!fieldId) return this
      const field = this.schema.get(fieldId)
      if (!field) return this

      const visitor = new RecordChartGroupVisitor(this.table, fieldId, visualization, this.em, this.qb)
      field.accept(visitor)
    }

    return this
  }

  pagination(pagination?: IPagination): this {
    if (!pagination) return this

    if (isNumber(pagination.limit)) {
      this.qb.limit(pagination.limit)
      if (isNumber(pagination.page)) {
        const offset = pagination.limit * pagination.page - pagination.limit
        this.qb.offset(offset)
      }
    }

    return this
  }

  count(): this {
    this.qb.count()
    return this
  }

  build(): this {
    return this
  }
}
