import type { Field } from "@undb/table"
import { sql } from "kysely"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class StringToDateStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    const tempField = this.tempField(field)

    const update = this.qb
      .updateTable(this.table.id.value)
      .set((eb) => ({
        [tempField]: eb
          .case()
          .when(field.id.value, "is", null)
          .then(sql`NULL`)
          .when(field.id.value, "=", "")
          .then(sql`NULL`)
          .else(sql`DATE(${sql.ref(field.id.value)})`)
          .end(),
      }))
      .compile()

    this.changeType(field, "timestamp", () => update)
  }
}
