/* eslint-disable @typescript-eslint/no-empty-function */
import type { ITableSpecVisitor, WithNewField, WithoutField, WithoutOption, WithTableSchema } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingTableBuilder } from '../entity/underlying-table/underlying-table.builder'

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

  async commit() {
    if (this.sb) {
      const query = this.sb.toQuery()
      await this.em.execute(query)
    }
    if (this.qb) {
      await this.em.execute(this.qb)
    }
    for (const sql of this.sqls) {
      await this.em.execute(sql)
    }
  }

  idEqual(): void {
    throw new Error('Method not implemented.')
  }
  nameEqual(): void {}
  schemaEqual(s: WithTableSchema): void {
    this.sb = this.#sb.alterTable(this.tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(this.knex, tb, this.tableName)
      builder.createUnderlying(s.schema.fields)
    })
  }
  viewsEqual(): void {}
  viewEqual(): void {}
  filterEqual(): void {}
  newField(s: WithNewField): void {
    this.sb = this.#sb.alterTable(this.tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(this.knex, tb, this.tableName)
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
  witoutOption(s: WithoutOption): void {
    this.qb = this.#qb.from(this.tableName).where(s.field.id.value, s.optionId.value).update(s.field.id.value, null)
  }
  withoutField(s: WithoutField): void {
    this.sqls.push(
      `
      alter table \`${this.tableName}\` drop column \`${s.field.id.value}\`;
      `,
    )
  }
  not(): this {
    return this
  }
}
