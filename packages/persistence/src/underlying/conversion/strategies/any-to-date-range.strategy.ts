import type { Field } from "@undb/table"
import { getDateRangeFieldName } from "../../underlying-table.util"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class AnyToDateRangeStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    if (field.type !== "dateRange") {
      return
    }
    const { start, end } = getDateRangeFieldName(field)

    const fieldId = field.id.value

    const addColumns = [this.tb.addColumn(start, "timestamp").compile(), this.tb.addColumn(end, "timestamp").compile()]

    const dropColumns = this.tb.dropColumn(fieldId).compile()

    this.addSql(...addColumns, dropColumns)
  }
}
