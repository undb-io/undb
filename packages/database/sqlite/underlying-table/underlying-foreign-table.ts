import type { Field, ParentField, ReferenceField } from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME, TreeField } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import type { IUderlyingForeignTableName, IUnderlyingForeignTable } from '../interfaces/underlying-foreign-table'

abstract class BaseUnderlyingForeignTable<F extends Field> implements IUnderlyingForeignTable {
  constructor(protected readonly foreignTableName: string, protected readonly field: F) {}

  abstract get name(): IUderlyingForeignTableName
  abstract getCreateTableSqls(knex: Knex): string[]
}

export class UnderlyingAdjacencyListTable extends BaseUnderlyingForeignTable<ReferenceField> {
  static ADJACENCY_LIST_CHILD_ID_FIELD = 'child_id'
  static ADJACENCY_LIST_PARENT_ID_FIELD = 'parent_id'

  get name(): IUderlyingForeignTableName {
    return `${this.field.id.value}_${this.foreignTableName}_adjacency_list`
  }

  getCreateTableSqls(knex: Knex): string[] {
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

export class UnderlyingClosureTable extends BaseUnderlyingForeignTable<TreeField | ParentField> {
  static CLOSURE_TABLE_CHILD_ID_FIELD = 'child_id'
  static CLOSURE_TABLE_PARENT_ID_FIELD = 'parent_id'
  static CLOSURE_TABLE_DEPTH_FIELD = 'depth'

  get name(): IUderlyingForeignTableName {
    const fieldId = this.field instanceof TreeField ? this.field.id.value : this.field.treeFieldId!.value
    return `${fieldId}_${this.foreignTableName}_closure_table`
  }

  getCreateTableSqls(knex: Knex): string[] {
    return [
      knex.schema
        .createTableIfNotExists(this.name, (tb) => {
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
       create index if not exists \`${this.name}_${UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD}_index\` on \`${this.name}\` (\`${UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD}\`)
       `,
        )
        .toQuery(),
    ]
  }

  connect(knex: Knex, parentRecordId: string, childrenRecordIds: string[] = []): string[] {
    const queries: string[] = []

    const query = knex
      .queryBuilder()
      .table(this.name)
      .delete()
      .where(UnderlyingAdjacencyListTable.ADJACENCY_LIST_PARENT_ID_FIELD, parentRecordId)
      .toQuery()

    queries.push(query)

    const rootInsert = knex(this.name)
      .insert({
        [UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD]: parentRecordId,
        [UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD]: 0,
        [UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD]: parentRecordId,
      })
      .toQuery()

    queries.push(rootInsert)

    if (childrenRecordIds?.length) {
      for (const recordId of childrenRecordIds) {
        const query = knex
          .raw(
            `
            insert into
             ${this.name}
              (${UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD},
                ${UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD},
                ${UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD})

            select
              p.${UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD},
              c.${UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD},
              p.${UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD}+c.${UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD}+1
            from ${this.name} as p, ${this.name} as c
            where
            p.${UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD}='${parentRecordId}'
            and
            c.${UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD}='${recordId}'
 `,
          )
          .toQuery()

        queries.push(query)
      }
    }

    return queries
  }
}
