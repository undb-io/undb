import type { Table as CoreTable, LookingFieldTypes, TableSchemaIdMap } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { LookupField, ParentField, ReferenceField, TreeField } from '../../entity/field.js'
import type { Table } from '../../entity/table.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { getForeignTableAlias } from './record.constants.js'
import { getExpandColumnName } from './record.util.js'

export class RecordSqliteReferenceQueryVisitorHelper {
  private readonly visited = new Set<string>()
  constructor(
    private readonly em: EntityManager,
    private readonly knex: Knex,
    private readonly qb: Knex.QueryBuilder,
  ) {}

  public visit(table: CoreTable, tableEntity: Table): void {
    const { knex, qb, visited } = this
    const lookingFields = table.schema.getLookingFields()
    for (const lookingField of lookingFields) {
      const visitor = new RecordSqliteReferenceQueryVisitor(table, qb, knex, visited)
      lookingField.accept(visitor)
      this.expandField(lookingField, table.schema.toIdMap(), tableEntity)
    }
  }

  public expandField(field: LookingFieldTypes, schema: TableSchemaIdMap, tableEntity: Table) {
    const jsonObjectEntries: [string, string][] = []
    const table = getForeignTableAlias(field, schema)

    const columns = tableEntity.fields.getItems()
    const column = columns.find((c) => c.id === field.id.value)

    const displayFieldIds = field.displayFieldIds.map((id) => id.value)
    for (const displayFieldId of displayFieldIds) {
      const displayField = (column as ReferenceField | TreeField | ParentField | LookupField).displayFields
        .getItems()
        .find((c) => c.id === displayFieldId)
      if (!displayField) continue

      let key = displayFieldId

      const f = displayField.toDomain()
      if (f.isSystem()) {
        const c = UnderlyingColumnFactory.create(f, table) as IUnderlyingColumn
        key = c.name
      }

      jsonObjectEntries.push([`'${key}'`, field.multiple ? `json_group_array(${table}.${key})` : `${table}.${key}`])
    }

    this.qb.select(
      this.knex.raw(
        `json_object('${field.id.value}',json_object(${jsonObjectEntries
          .map((k) => k.join(','))
          .join(',')})) as ${getExpandColumnName(field.id.value)}`,
      ),
    )
  }
}
