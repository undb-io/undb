import type { Field, ReferenceField, TreeField } from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import type { IUderlyingForeignTableName, IUnderlyingForeignTable } from '../interfaces/underlying-foreign-table'

abstract class BaseUnderlyingForeignTable<F extends Field> implements IUnderlyingForeignTable {
  constructor(protected readonly foreignTableName: string, protected readonly field: F) {}

  abstract get name(): IUderlyingForeignTableName
  abstract getSqls(knex: Knex): string[]
}

export class UnderlyingAdjacencyListTable extends BaseUnderlyingForeignTable<ReferenceField> {
  static ADJACENCY_LIST_CHILD_ID_FIELD = 'child_id'
  static ADJACENCY_LIST_PARENT_ID_FIELD = 'parent_id'

  get name(): IUderlyingForeignTableName {
    return `${this.field.id.value}_${this.foreignTableName}_adjacency_list`
  }

  getSqls(knex: Knex): string[] {
    return [
      knex.schema
        .createTable(this.name, (tb) => {
          tb.string(UnderlyingAdjacencyListTable.ADJACENCY_LIST_CHILD_ID_FIELD)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.foreignTableName)

          tb.string(UnderlyingAdjacencyListTable.ADJACENCY_LIST_PARENT_ID_FIELD)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.foreignTableName)

          tb.primary([
            UnderlyingAdjacencyListTable.ADJACENCY_LIST_CHILD_ID_FIELD,
            UnderlyingAdjacencyListTable.ADJACENCY_LIST_PARENT_ID_FIELD,
          ])
        })
        .toQuery(),
    ]
  }
}

export class UnderlyingClosureTable extends BaseUnderlyingForeignTable<TreeField> {
  static CLOSURE_TABLE_CHILD_ID_FIELD = 'child_id'
  static CLOSURE_TABLE_PARENT_ID_FIELD = 'parent_id'
  static CLOSURE_TABLE_DEPTH_FIELD = 'depth'

  get name(): IUderlyingForeignTableName {
    return `${this.field.id.value}_${this.foreignTableName}_closure_table`
  }

  getSqls(knex: Knex): string[] {
    return [
      knex.schema
        .createTable(this.name, (tb) => {
          tb.string(UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.foreignTableName)
            .onDelete('CASCADE')

          tb.string(UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.foreignTableName)
            .onDelete('CASCADE')

          tb.integer(UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD).notNullable().defaultTo(0)

          tb.primary([
            UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD,
            UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD,
          ])
        })
        .toQuery(),
      knex
        .raw(
          `
       create index \`${this.name}_${UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD}_index\` on \`${this.name}\` (\`${UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD}\`)
       `,
        )
        .toQuery(),
    ]
  }
}
