import { INTERNAL_COLUMN_ID_NAME, Table } from '@undb/core'

export class SqliteSearchTable {
  constructor(public readonly table: Table) {}

  public get name() {
    return `undb_search_${this.table.id.value}`
  }

  public get idField() {
    return INTERNAL_COLUMN_ID_NAME
  }

  public get fields() {
    return this.table.schema.searchableFields.map((f) => f.id.value).concat(this.idField)
  }

  public getCreateFT5Query(): string {
    const fieldNames = this.fields.map((f) => (f === this.idField ? `'${f}' UNINDEXED` : `'${f}'`)).join(', ')

    return `CREATE VIRTUAL TABLE ${this.name} USING fts5(${fieldNames});`
  }
}
