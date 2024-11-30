import type { Field } from "@undb/table"
import { sql } from "kysely"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class AnyToCurrencyStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    const tempField = this.tempField(field)

    this.changeType(field, "integer", () => {
      return this.qb
        .updateTable(this.table.id.value)
        .set((eb) => ({
          [tempField]: eb
            .case()
            .when(field.id.value, "is", null)
            .then(sql`NULL`)
            .when(field.id.value, "=", "")
            .then(sql`NULL`)
            .else(eb.cast(sql.raw(`CAST(${field.id.value} AS real) * 100`), "integer"))
            .end(),
        }))
        .compile()
    })
  }
}
