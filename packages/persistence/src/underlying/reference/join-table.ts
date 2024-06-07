import type { ReferenceField, TableDo } from "@undb/table"

export class JoinTable {
  constructor(
    public readonly table: TableDo,
    public readonly field: ReferenceField,
  ) {}

  getFieldId(): string {
    return this.field.isOwner ? this.field.id.value : this.field.symmetricFieldId!
  }

  getSymmetricFieldId(): string {
    return this.field.isOwner ? this.field.foreignTableId : this.table.id.value
  }

  getTableName() {
    const { field } = this
    const { isOwner, foreignTableId } = field
    return `$${isOwner ? foreignTableId : this.table.id.value}_${this.getFieldId()}_join_table`
  }
}
