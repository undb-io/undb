import type { Field } from "@undb/table"
import { sql } from "kysely"
import { TEMP_FIELD_PREFIX } from "../conversion.constant"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class StringToBooleanStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    const tempField = TEMP_FIELD_PREFIX + field.id.value

    const update = this.qb
      .updateTable(this.table.id.value)
      .set((eb) => ({
        [tempField]: eb
          .case()
          .when(field.id.value, "is", null)
          .then(0)
          .when(field.id.value, "=", "")
          .then(0)
          .when(sql`LOWER(${sql.raw(field.id.value)}) IN ('true', 'yes', '1')`)
          .then(1)
          .when(sql`LOWER(${sql.raw(field.id.value)}) IN ('false', 'no', '0')`)
          .then(0)
          .else(0)
          .end(),
      }))
      .compile()

    this.changeType(field, "integer", () => update)
  }
}
