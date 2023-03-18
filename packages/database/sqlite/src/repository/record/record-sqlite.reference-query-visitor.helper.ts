import type { Table } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { expandField } from './record.util.js'

export class RecordSqliteReferenceQueryVisitorHelper {
  private readonly visited = new Set<string>()
  constructor(
    private readonly em: EntityManager,
    private readonly knex: Knex,
    private readonly qb: Knex.QueryBuilder,
  ) {}

  public async visit(table: Table): Promise<void> {
    const { em, knex, qb, visited } = this
    const lookingFields = table.schema.getLookingFields()
    for (const lookingField of lookingFields) {
      const visitor = new RecordSqliteReferenceQueryVisitor(table, qb, knex, visited)
      lookingField.accept(visitor)
      await expandField(lookingField, table.schema.toIdMap(), em, knex, qb)
    }
  }
}
