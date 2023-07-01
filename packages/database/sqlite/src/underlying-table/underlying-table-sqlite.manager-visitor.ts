/* eslint-disable @typescript-eslint/no-empty-function */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type {
  ITableSpecVisitor,
  WithDuplicatedField,
  WithForeignTableId,
  WithNewFieldType,
  WithRatingMax,
  WithTableSchema,
  WithTableViewId,
  WithoutOption,
} from '@undb/core'
import { WithNewField, isSelectFieldType } from '@undb/core'
import type { Job } from '../repository/base-entity-manager.js'
import { RecordSqliteDuplicateValueVisitor } from '../repository/record/record-sqlite-duplicate-value.visitor.js'
import { UnderlyingColumnConvertTypeVisitor } from './underlying-column-type-modifier.visitor.js'
import { UnderlyingColumnBuilder } from './underlying-column.builder.js'
import { AdjacencyListTable } from './underlying-foreign-table.js'
import { UnderlyingTempDuplicateOptionTable } from './underlying-temp-duplicate-option-table.js'

export class UnderlyingTableSqliteManagerVisitor implements ITableSpecVisitor {
  private readonly knex: Knex
  private sb?: Knex.SchemaBuilder
  private qb?: Knex.QueryBuilder
  #queries: string[] = []
  #jobs: Job[] = []
  constructor(private readonly tableName: string, private readonly em: EntityManager) {
    const knex = em.getKnex()
    this.knex = knex
  }
  viewIdEqual(s: WithTableViewId): void {}
  withoutWidget(): void {}
  withChartAggregate(): void {}
  withNumberAggregate(): void {}
  withVisualizationName(): void {}
  withWidgetsLayout(): void {}
  get #sb() {
    return this.sb ?? this.knex.schema
  }

  get #qb() {
    return this.qb ?? this.knex.queryBuilder()
  }

  public get queries(): string[] {
    return [this.sb?.toQuery() ?? '', this.qb?.toQuery() ?? '', ...this.#queries].filter(Boolean)
  }

  async commit() {
    for (const query of this.queries) {
      await this.em.execute(query)
    }
    for (const job of this.#jobs) {
      await job()
    }
  }

  idEqual(): void {
    throw new Error('Method not implemented.')
  }
  nameEqual(): void {}
  emojiEqual(): void {}
  schemaEqual(s: WithTableSchema): void {
    this.sb = this.#sb.alterTable(this.tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(this.em, this.knex, tb, this.tableName)
      builder.createUnderlying(s.schema.nonSystemFields)
      this.#queries.push(...builder.queries)
    })
  }
  viewsEqual(): void {}
  viewEqual(): void {}
  viewNameEqual(): void {}
  newView(): void {}
  withoutView(): void {}
  viewsOrderEqual(): void {}
  filterEqual(): void {}
  ratingMaxEqual(s: WithRatingMax): void {
    const query = this.#qb.update(s.fieldId, s.max).where(s.fieldId, '>', s.max).from(this.tableName).toQuery()
    this.#queries.push(query)
  }
  currencySymbolEqual(): void {}
  rowHeightEqual(): void {}
  withNewFieldType(s: WithNewFieldType): void {
    const visitor = new UnderlyingColumnConvertTypeVisitor(this.tableName, s.newType, this.em, this.knex)
    s.field.accept(visitor)

    this.#queries.unshift(...visitor.queries)
    this.#jobs.unshift(...visitor.jobs)
  }
  newField(s: WithNewField): void {
    const field = s.field
    if (field.isSystem()) {
      return
    }

    const query = this.#sb
      .alterTable(this.tableName, (tb) => {
        const builder = new UnderlyingColumnBuilder(this.em, this.knex, tb, this.tableName)
        builder.createUnderlying([field])
        this.#queries.push(...builder.queries)
      })
      .toQuery()

    const queries = query.split(';\n')

    this.#queries.push(...queries)
  }
  withDuplicatedField(s: WithDuplicatedField): void {
    const spec = new WithNewField(s.field)
    this.newField(spec)

    if (s.includesValues) {
      if (isSelectFieldType(s.field) && isSelectFieldType(s.from)) {
        const table = new UnderlyingTempDuplicateOptionTable(this.tableName, s.from, s.field, this.knex)
        this.#queries.push(...table.create())
      }

      const knex = this.em.getKnex()
      const visitor = new RecordSqliteDuplicateValueVisitor(this.tableName, s.from, this.em, knex.queryBuilder(), knex)

      s.field.accept(visitor)
      this.#queries.push(...visitor.queries)
      this.#jobs.push(...visitor.jobs)

      if (isSelectFieldType(s.field) && isSelectFieldType(s.from)) {
        const table = new UnderlyingTempDuplicateOptionTable(this.tableName, s.from, s.field, this.knex)
        this.#queries.push(table.drop())
      }
    }
  }
  fieldsOrder(): void {}
  fieldWidthEqual(): void {}
  fieldVisibility(): void {}
  displayTypeEqual(): void {}
  kanbanFieldEqual(): void {}
  treeViewFieldEqual(): void {}
  calendarFieldEqual(): void {}
  optionsEqual(): void {}
  newOption(): void {}
  optionEqual(): void {}
  sortsEqual(): void {}
  pinnedFields(): void {}
  witoutOption(s: WithoutOption): void {
    this.qb = this.#qb.from(this.tableName).where(s.fieldId, s.optionKey.value).update(s.fieldId, null)
  }
  withoutField(): void {}
  fieldOptionsEqual(): void {}
  withFieldName(): void {}
  withFieldDescription(): void {}
  withFieldDisplay(): void {}
  displayFieldsEqual(): void {}
  withFormat(): void {}
  withTimeFormat(): void {}
  withShowSystemFields(): void {}
  foreignTableIdEqual(s: WithForeignTableId): void {
    const adjacencyListTable = new AdjacencyListTable(this.tableName, s.fieldId, s.foreignTableId.value, true)
    const queries = adjacencyListTable.getCreateTableSqls(this.knex)
    this.#queries.push(...queries)
  }
  withFieldRequirement(): void {}
  symmetricReferenceFieldEqual(): void {}
  withWidget(): void {}
  withAggregateFieldId(): void {}
  withReferenceFieldId(): void {}
  or(): this {
    return this
  }
  not(): this {
    return this
  }
}
