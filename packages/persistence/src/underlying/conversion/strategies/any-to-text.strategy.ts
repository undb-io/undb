import type { Field } from "@undb/table"
import { TEMP_FIELD_PREFIX } from "../conversion.constant"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class AnyToTextStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    const tempField = TEMP_FIELD_PREFIX + field.id.value
    const addColumn = this.tb.addColumn(tempField, "text").compile()

    const update = this.qb
      .updateTable(this.table.id.value)
      .set((eb) => ({
        [tempField]: eb.cast(field.id.value, "text"),
      }))
      .compile()

    const dropColumn = this.tb.dropColumn(field.id.value).compile()
    const renameColumn = this.tb.renameColumn(tempField, field.id.value).compile()

    this.addSql(addColumn, update, dropColumn, renameColumn)
  }
}
