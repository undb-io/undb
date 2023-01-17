/* eslint-disable @typescript-eslint/no-empty-function */
import type { ITableSpecVisitor, WithNewField, WithoutField, WithoutOption, WithTableSchema } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingColumnBuilder } from './underlying-column.builder'
import { UnderlyingColumnFactory } from './underlying-column.factory'

export class UnderlyingTableSqliteManagerVisitor implements ITableSpecVisitor {
  private readonly knex: Knex
  private sb?: Knex.SchemaBuilder
  private qb?: Knex.QueryBuilder
  private sqls: string[] = []
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
    return [this.sb?.toQuery() ?? '', this.qb?.toQuery() ?? '', ...this.sqls].filter(Boolean)
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
      builder.createUnderlying(s.schema.fields)
    })
  }
  viewsEqual(): void {}
  viewEqual(): void {}
  filterEqual(): void {}
  newField(s: WithNewField): void {
    this.sb = this.#sb.alterTable(this.tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(this.knex, tb)
      builder.createUnderlying([s.field])
    })
  }
  fieldsOrder(): void {}
  fieldWidthEqual(): void {}
  fieldVisibility(): void {}
  displayTypeEqual(): void {}
  kanbanFieldEqual(): void {}
  calendarFieldEqual(): void {}
  optionsEqual(): void {}
  newOption(): void {}
  optionEqual(): void {}
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
    this.sqls.push(...sqls)
  }
  fieldOptionsEqual(): void {}
  not(): this {
    return this
  }
}
