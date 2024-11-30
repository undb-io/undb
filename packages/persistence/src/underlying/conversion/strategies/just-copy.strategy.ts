import type { Field } from "@undb/table"
import { getUnderlyingColumnType } from "../../underlying-table.util"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class JustCopyStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    const type = getUnderlyingColumnType(field.type)
    this.changeType(field, type, () =>
      this.qb
        .updateTable(this.table.id.value)
        .set((eb) => ({ [this.tempField(field)]: eb.ref(field.id.value) }))
        .compile(),
    )
  }
}
