import type { Field } from "@undb/table"
import { getUnderlyingColumnType } from "../../underlying-table.util"
import { TEMP_FIELD_PREFIX } from "../conversion.constant"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class ClearValueStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    const tempField = TEMP_FIELD_PREFIX + field.id.value

    const type = getUnderlyingColumnType(field.type)
    const addColumn = this.tb.addColumn(tempField, type).compile()
    const dropColumn = this.tb.dropColumn(field.id.value).compile()
    const renameColumn = this.tb.renameColumn(tempField, field.id.value).compile()

    this.addSql(addColumn, dropColumn, renameColumn)
  }
}
