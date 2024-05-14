import type { IFieldVisitor, NumberField, StringField } from "@undb/table"
import type { CreateTableBuilder } from "kysely"

export class UnderlyingTableFieldVisitor implements IFieldVisitor {
  constructor(public tb: CreateTableBuilder<any, any>) {}

  string(field: StringField): void {
    this.tb = this.tb.addColumn(field.id.value, "varchar(255)")
  }
  number(field: NumberField): void {
    this.tb = this.tb.addColumn(field.id.value, "real")
  }
}
