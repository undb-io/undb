import type { CreatedAtField, IFieldVisitor, IdField, NumberField, StringField } from "@undb/table"
import { sql, type CreateTableBuilder } from "kysely"

export class UnderlyingTableFieldVisitor implements IFieldVisitor {
  constructor(public tb: CreateTableBuilder<any, any>) {}

  createdAt(field: CreatedAtField): void {
    this.tb = this.tb.addColumn(field.id.value, "datetime", (b) => b.defaultTo(sql`(CURRENT_TIMESTAMP)`).notNull())
  }
  id(field: IdField): void {
    this.tb = this.tb.addColumn(field.id.value, "varchar(50)", (b) => b.notNull().unique())
  }
  string(field: StringField): void {
    this.tb = this.tb.addColumn(field.id.value, "varchar(255)")
  }
  number(field: NumberField): void {
    this.tb = this.tb.addColumn(field.id.value, "real")
  }
}
