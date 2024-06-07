import type { ReferenceField, TableDo } from "@undb/table"

export class JoinTable {
  constructor(
    public readonly table: TableDo,
    public readonly field: ReferenceField,
  ) {}

  get #option() {
    return this.field.option.expect("option is not found")
  }

  get #isOwner() {
    return this.#option.isOwner
  }

  public getName() {
    if (this.#isOwner) {
      return `$${this.table.id.value}_${this.field.id.value}_${this.#option.foreignTableId}_join_table`
    }

    return `$${this.#option.foreignTableId}_${this.#option.symmetricFieldId}_${this.table.id.value}_join_table`
  }
}
