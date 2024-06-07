import type { ReferenceField, TableDo } from "@undb/table"

export class JoinTable {
  constructor(
    public readonly table: TableDo,
    public readonly field: ReferenceField,
  ) {}

  getFieldId(): string {
    return this.field.isOwner ? this.field.id.value : this.field.foreignTableId
  }

  getSymmetricFieldId(): string {
    return this.field.isOwner ? this.table.id.value : this.field.symmetricFieldId!
  }

  getTableName() {
    if (this.field.isOwner) {
      return `$${this.table.id.value}_${this.getFieldId()}_${this.field.foreignTableId}_join_table`
    }

    return `$${this.field.foreignTableId}_${this.getSymmetricFieldId()}_${this.table.id.value}_join_table`
  }
}
