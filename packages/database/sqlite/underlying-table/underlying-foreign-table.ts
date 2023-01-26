import type { Field, ParentField, ReferenceField } from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME, TreeField } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import type { IUderlyingForeignTableName, IUnderlyingForeignTable } from '../interfaces/underlying-foreign-table'

abstract class BaseUnderlyingForeignTable<F extends Field> implements IUnderlyingForeignTable {
  constructor(protected readonly foreignTableName: string, protected readonly field: F) {}

  abstract get name(): IUderlyingForeignTableName
  abstract getCreateTableSqls(knex: Knex): string[]
}

export class AdjacencyListTable extends BaseUnderlyingForeignTable<ReferenceField> {
  static CHILD_ID = 'child_id'
  static PARENT_ID = 'parent_id'

  get name(): IUderlyingForeignTableName {
    return `${this.field.id.value}_${this.foreignTableName}_adjacency_list`
  }

  getCreateTableSqls(knex: Knex): string[] {
    return [
      knex.schema
        .createTable(this.name, (tb) => {
          tb.string(AdjacencyListTable.CHILD_ID)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.foreignTableName)

          tb.string(AdjacencyListTable.PARENT_ID)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.foreignTableName)

          tb.primary([AdjacencyListTable.CHILD_ID, AdjacencyListTable.PARENT_ID])
        })
        .toQuery(),
    ]
  }
}

export class ClosureTable extends BaseUnderlyingForeignTable<TreeField | ParentField> {
  static CHILD_ID = 'child_id'
  static PARENT_ID = 'parent_id'
  static DEPTH = 'depth'

  get name(): IUderlyingForeignTableName {
    const fieldId = this.field instanceof TreeField ? this.field.id.value : this.field.treeFieldId.value
    return `${fieldId}_${this.foreignTableName}_closure_table`
  }

  getCreateTableSqls(knex: Knex): string[] {
    return [
      knex.schema
        .createTableIfNotExists(this.name, (tb) => {
          tb.string(ClosureTable.CHILD_ID)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.foreignTableName)
            .onDelete('CASCADE')

          tb.string(ClosureTable.PARENT_ID)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.foreignTableName)
            .onDelete('CASCADE')

          tb.integer(ClosureTable.DEPTH).notNullable().defaultTo(0)

          tb.primary([ClosureTable.CHILD_ID, ClosureTable.PARENT_ID])
        })
        .toQuery(),
      knex
        .raw(
          `
       create index if not exists \`${this.name}_${ClosureTable.DEPTH}_index\` on \`${this.name}\` (\`${ClosureTable.DEPTH}\`)
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
      .where(AdjacencyListTable.PARENT_ID, parentRecordId)
      .toQuery()

    queries.push(query)

    const rootInsert = knex(this.name)
      .insert({
        [ClosureTable.CHILD_ID]: parentRecordId,
        [ClosureTable.DEPTH]: 0,
        [ClosureTable.PARENT_ID]: parentRecordId,
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
              (${ClosureTable.PARENT_ID},
                ${ClosureTable.CHILD_ID},
                ${ClosureTable.DEPTH})

            select
              p.${ClosureTable.PARENT_ID},
              c.${ClosureTable.CHILD_ID},
              p.${ClosureTable.DEPTH}+c.${ClosureTable.DEPTH}+1
            from ${this.name} as p, ${this.name} as c
            where
            p.${ClosureTable.CHILD_ID}='${parentRecordId}'
            and
            c.${ClosureTable.PARENT_ID}='${recordId}'
 `,
          )
          .toQuery()

        queries.push(query)
      }
    }

    return queries
  }

  moveParent(knex: Knex, recordId: string, parentId: string | null): string[] {
    const queries: string[] = []

    queries.push(
      knex
        .queryBuilder()
        .delete()
        .from(this.name)
        .whereIn(
          ClosureTable.CHILD_ID,
          knex.queryBuilder().select(ClosureTable.CHILD_ID).from(this.name).where(ClosureTable.PARENT_ID, recordId),
        )
        .whereNotIn(
          ClosureTable.PARENT_ID,
          knex.queryBuilder().select(ClosureTable.CHILD_ID).from(this.name).where(ClosureTable.PARENT_ID, recordId),
        )
        .toQuery(),
    )

    if (parentId) {
      queries.push(
        `
        INSERT INTO ${this.name} (${ClosureTable.PARENT_ID}, ${ClosureTable.CHILD_ID}, ${ClosureTable.DEPTH})

        SELECT supertree.${ClosureTable.PARENT_ID}, subtree.${ClosureTable.CHILD_ID},
        supertree.${ClosureTable.DEPTH}+subtree.${ClosureTable.DEPTH}+1
        FROM ${this.name} AS supertree JOIN ${this.name} AS subtree
        WHERE subtree.${ClosureTable.PARENT_ID} = '${recordId}'
        AND supertree.${ClosureTable.CHILD_ID} = '${parentId}';
        `,
      )
    }

    return queries
  }
}
