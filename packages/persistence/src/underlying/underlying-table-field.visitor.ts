import type { IFieldVisitor, NumberField, StringField } from "@undb/table"
import type { IdField } from "@undb/table/src/modules/schema/fields/variants/id-field"
import type { CreateTableBuilder } from "kysely"

export class UnderlyingTableFieldVisitor implements IFieldVisitor {
  constructor(public tb: CreateTableBuilder<any, any>) {}
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
