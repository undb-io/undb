import type { Knex } from '@mikro-orm/better-sqlite'
import type { Field, ParentField, ReferenceField } from '@undb/core'
import { INTERNAL_COLUMN_ID_NAME, TreeField } from '@undb/core'
import { USER_TABLE_NAME } from '../entity/user.js'
import type {
  IUderlyingForeignTableName,
  IUderlyingForeignTableReferenceFieldId,
  IUnderlyingForeignTable,
} from '../interfaces/underlying-foreign-table.js'

export type UnderlyingTableForeignTableAlias = `uta_${string}`

export const getUnderlyingTableAlias = (field: Field): UnderlyingTableForeignTableAlias => `uta_${field.id.value}`

abstract class BaseUnderlyingForeignTable<F extends Field> implements IUnderlyingForeignTable {
  constructor(protected readonly tableId: string, protected readonly field: F) {}

  abstract get name(): IUderlyingForeignTableName
  abstract get fromId(): IUderlyingForeignTableReferenceFieldId
  abstract get toId(): IUderlyingForeignTableReferenceFieldId
  abstract getCreateTableSqls(knex: Knex): string[]
}

export class CollaboratorForeignTable implements IUnderlyingForeignTable {
  constructor(protected readonly tableId: string, protected readonly fieldId: string) {}
  static RECORD_ID = 'record_id'
  static USER_ID = 'user_id'

  get name(): IUderlyingForeignTableName {
    return `${this.fieldId}_collaborator`
  }

  get fromId(): IUderlyingForeignTableReferenceFieldId {
    return `${this.name}.${CollaboratorForeignTable.RECORD_ID}`
  }

  get toId(): IUderlyingForeignTableReferenceFieldId {
    return `${this.name}.${CollaboratorForeignTable.USER_ID}`
  }

  getCreateTableSqls(knex: Knex): string[] {
    return [
      knex.schema
        .createTableIfNotExists(this.name, (tb) => {
          tb.string(CollaboratorForeignTable.USER_ID)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(USER_TABLE_NAME)

          tb.string(CollaboratorForeignTable.RECORD_ID)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.tableId)

          tb.primary([CollaboratorForeignTable.RECORD_ID, CollaboratorForeignTable.USER_ID])
        })
        .toQuery(),
    ]
  }
}

export class AdjacencyListTable implements IUnderlyingForeignTable {
  static TO_ID = 'to_id'
  static FROM_ID = 'from_id'

  constructor(
    public readonly tableId: string,
    public readonly fieldId: string,
    private readonly _foreignTableId?: string,
    private readonly isOwner = false,
    private readonly symmetricReferenceFieldId?: string,
  ) {}

  static fromField(tableId: string, field: ReferenceField) {
    return new this(
      tableId,
      field.id.value,
      field.foreignTableId.into(),
      field.isOwner,
      field.symmetricReferenceFieldId?.value,
    )
  }

  private get foreignTableId() {
    return this._foreignTableId ?? this.tableId
  }

  get name(): IUderlyingForeignTableName {
    if (this.isOwner) {
      return `${this.fieldId}_${this.foreignTableId}_adjacency_list`
    }
    const symmetricReferenceId = this.symmetricReferenceFieldId
    if (!symmetricReferenceId) {
      return `${this.fieldId}_${this.foreignTableId}_adjacency_list`
    }

    return `${symmetricReferenceId}_${this.tableId}_adjacency_list`
  }

  get fromId(): IUderlyingForeignTableReferenceFieldId {
    const field =
      !!this.symmetricReferenceFieldId && !this.isOwner ? AdjacencyListTable.TO_ID : AdjacencyListTable.FROM_ID
    return `${this.name}.${field}`
  }

  get toId(): IUderlyingForeignTableReferenceFieldId {
    const field =
      !!this.symmetricReferenceFieldId && !this.isOwner ? AdjacencyListTable.FROM_ID : AdjacencyListTable.TO_ID

    return `${this.name}.${field}`
  }

  getCreateTableSqls(knex: Knex): string[] {
    return [
      knex.schema
        .createTableIfNotExists(this.name, (tb) => {
          tb.string(AdjacencyListTable.TO_ID)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.foreignTableId)

          tb.string(AdjacencyListTable.FROM_ID).notNullable().references(INTERNAL_COLUMN_ID_NAME).inTable(this.tableId)

          tb.primary([AdjacencyListTable.TO_ID, AdjacencyListTable.FROM_ID])
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
    return `${fieldId}_${this.tableId}_closure_table`
  }

  get fromId(): IUderlyingForeignTableReferenceFieldId {
    return `${this.name}.${ClosureTable.PARENT_ID}`
  }

  get toId(): IUderlyingForeignTableReferenceFieldId {
    return `${this.name}.${ClosureTable.CHILD_ID}`
  }

  getCreateTableSqls(knex: Knex): string[] {
    return [
      knex.schema
        .createTableIfNotExists(this.name, (tb) => {
          tb.string(ClosureTable.CHILD_ID)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.tableId)
            .onDelete('CASCADE')

          tb.string(ClosureTable.PARENT_ID)
            .notNullable()
            .references(INTERNAL_COLUMN_ID_NAME)
            .inTable(this.tableId)
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

    const query = knex.queryBuilder().table(this.name).delete().where(ClosureTable.PARENT_ID, parentRecordId).toQuery()

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
