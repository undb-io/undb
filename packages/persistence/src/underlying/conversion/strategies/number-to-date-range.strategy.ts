import type { Field } from "@undb/table"
import { sql } from "kysely"
import { getDateRangeFieldName } from "../../underlying-table.util"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class NumberToDateRangeStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    if (field.type !== "dateRange") {
      return
    }
    const { start, end } = getDateRangeFieldName(field)

    const fieldId = field.id.value

    const addColumns = [this.tb.addColumn(start, "timestamp").compile(), this.tb.addColumn(end, "timestamp").compile()]

    const updated = this.qb
      .updateTable(this.table.id.value)
      .set((eb) => ({
        [start]: sql`datetime(${sql.ref(fieldId)}, 'unixepoch')`,
        [end]: sql`datetime(${sql.ref(fieldId)}, 'unixepoch')`,
      }))
      .compile()

    const dropColumns = this.tb.dropColumn(fieldId).compile()

    this.addSql(...addColumns, updated, dropColumns)
  }
}
