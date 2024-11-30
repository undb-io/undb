import type { Field } from "@undb/table"
import { CaseWhenBuilder, sql } from "kysely"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class StringToSelectStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    if (field.type !== "select") {
      return
    }

    const tempField = this.tempField(field)
    const options = field.options
    const update = this.qb
      .updateTable(this.table.id.value)
      .set((eb) => {
        let builder: CaseWhenBuilder<any, any, any, any> = eb
          .case()
          .when(field.id.value, "is", null)
          .then(sql`NULL`)

        for (const option of options) {
          builder = builder
            .when(field.id.value, "=", option.name)
            .then(field.isSingle ? sql`${option.id}` : eb.fn("json_array", [sql`${option.id}`]))
        }

        return {
          [tempField]: builder.else(sql`NULL`).end(),
        }
      })
      .compile()
    this.changeType(field, "text", () => update)
  }
}
