import type { ReferenceField, TableDo } from "@undb/table"

export class JoinTable {
  static FROM_ID = "from_id"
  static TO_ID = "to_id"

  constructor(
    public readonly table: TableDo,
    public readonly field: ReferenceField,
  ) {}

  private get isOwner() {
    return this.field.option.isOwner
  }

  public getName() {
    if (this.isOwner) {
      return `$${this.table.id.value}_${this.field.id.value}_${this.field.option.foreignTableId}_join_table`
    }

    return `$${this.field.option.foreignTableId}_${this.field.option.symmetricFieldId}_${this.table.id.value}_join_table`
  }
}
