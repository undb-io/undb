import type { ReferenceField, TableDo } from "@undb/table"

export class JoinTable {
  constructor(
    public readonly table: TableDo,
    public readonly field: ReferenceField,
  ) {}

  getValueFieldId(): string {
    return this.field.isOwner ? this.field.id.value : this.table.id.value
  }

  getSymmetricValueFieldId(): string {
    return this.field.isOwner ? this.field.foreignTableId : this.field.symmetricFieldId!
  }

  getTableName() {
    const { field } = this
    const { isOwner, foreignTableId } = field
    return `$${isOwner ? foreignTableId : this.table.id.value}_${isOwner ? this.table.id.value + "_" + field.id.value : field.foreignTableId + "_" + field.symmetricFieldId!}_join_table`
  }
}
