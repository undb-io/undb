import { type Field } from "@undb/table"
import { CaseWhenBuilder, sql } from "kysely"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class SelectToStringStrategy extends UnderlyingConversionStrategy {
  convert(field: Field, previousField: Field): void | Promise<void> {
    if (previousField.type !== "select") {
      return
    }

    const tempField = this.tempField(field)
    const options = previousField.options
    const update = this.qb
      .updateTable(this.table.id.value)
      .set((eb) => {
        let builder: CaseWhenBuilder<any, any, any, any> = eb
          .case()
          .when(field.id.value, "is", null)
          .then(sql`NULL`)

        for (const option of options) {
          builder = builder.when(field.id.value, "=", option.id).then(sql`${option.name}`)
        }

        return {
          [tempField]: builder.else(sql`NULL`).end(),
        }
      })
      .compile()
    this.changeType(field, "text", () => update)
  }
}
