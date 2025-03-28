import type { Field } from "@undb/table"
import { sql } from "kysely"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class AnyToUrlStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    const tempField = this.tempField(field)
    this.changeType(field, "varchar", () =>
      this.qb
        .updateTable(this.table.id.value)
        .set((eb) => ({
          [tempField]: eb
            .case()
            .when(field.id.value, "is", null)
            .then(sql`NULL`)
            .when(field.id.value, "=", "")
            .then(sql`NULL`)
            .when(field.id.value, "like", "http%")
            .then(eb.cast(field.id.value, "varchar"))
            .else(sql`NULL`)
            .end(),
        }))
        .compile(),
    )
  }
}
