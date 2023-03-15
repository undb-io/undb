/* eslint-disable @typescript-eslint/no-empty-function */
import type { ITableSpecVisitor, WithNewField, WithoutField, WithoutOption, WithTableSchema } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingColumnBuilder } from './underlying-column.builder.js'
import { UnderlyingColumnFactory } from './underlying-column.factory.js'

export class UnderlyingTableSqliteManagerVisitor implements ITableSpecVisitor {
  private readonly knex: Knex
  private sb?: Knex.SchemaBuilder
  private qb?: Knex.QueryBuilder
  #queries: string[] = []
  constructor(private readonly tableName: string, private readonly em: EntityManager) {
    const knex = em.getKnex()
    this.knex = knex
  }
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
  }

  idEqual(): void {
    throw new Error('Method not implemented.')
  }
  nameEqual(): void {}
  schemaEqual(s: WithTableSchema): void {
    this.sb = this.#sb.alterTable(this.tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(this.knex, tb)
      builder.createUnderlying(s.schema.nonSystemFields)
    })
  }
  viewsEqual(): void {}
  viewEqual(): void {}
  viewNameEqual(): void {}
  newView(): void {}
  withoutView(): void {}
  viewsOrderEqual(): void {}
  filterEqual(): void {}
  newField(s: WithNewField): void {
    const field = s.field
    if (field.isSystem()) {
      return
    }

    const query = this.#sb
      .alterTable(this.tableName, (tb) => {
        const builder = new UnderlyingColumnBuilder(this.knex, tb)
        builder.createUnderlying([field])
      })
      .toQuery()

    const queries = query.split(';\n')

    this.#queries.push(...queries)
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
    this.qb = this.#qb.from(this.tableName).where(s.field.id.value, s.optionKey.value).update(s.field.id.value, null)
  }
  withoutField(s: WithoutField): void {
    const fields = UnderlyingColumnFactory.createMany([s.field])
    const sqls = fields.map(
      (f) =>
        `
    alter table \`${this.tableName}\` drop column \`${f.name}\`;
    `,
    )
    this.#queries.push(...sqls)
  }
  fieldOptionsEqual(): void {}
  withFieldName(): void {}
  withFieldDescription(): void {}
  displayFieldsEqual(): void {}
  withFormat(): void {}
  withShowSystemFields(): void {}
  not(): this {
    return this
  }
}
