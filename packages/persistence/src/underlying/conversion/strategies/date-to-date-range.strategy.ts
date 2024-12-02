import type { Field } from "@undb/table"
import { getDateRangeFieldName } from "../../underlying-table.util"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class DateToDateRangeStrategy extends UnderlyingConversionStrategy {
  convert(field: Field, previousField: Field): void | Promise<void> {
    if (field.type !== "dateRange" || previousField.type !== "date") {
      return
    }
    const { start, end } = getDateRangeFieldName(field)

    const fieldId = field.id.value

    const addColumns = [this.tb.addColumn(start, "timestamp").compile(), this.tb.addColumn(end, "timestamp").compile()]

    const updated = this.qb
      .updateTable(this.table.id.value)
      .set((eb) => ({
        [start]: eb.ref(fieldId),
        [end]: eb.ref(fieldId),
      }))
      .compile()

    const dropColumns = this.tb.dropColumn(fieldId).compile()

    this.addSql(...addColumns, updated, dropColumns)
  }
}
