import { type Field } from "@undb/table"
import { getTableName } from "drizzle-orm"
import { CaseWhenBuilder, sql } from "kysely"
import { users } from "../../../schema/sqlite"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class UserToStringStrategy extends UnderlyingConversionStrategy {
  convert(field: Field, previousField: Field): void | Promise<void> {
    if (previousField.type !== "user") {
      return
    }

    const userTable = getTableName(users)

    const tempField = this.tempField(field)
    const update = this.qb
      .updateTable(this.table.id.value)
      .set((eb) => {
        let builder: CaseWhenBuilder<any, any, any, any> = eb
          .case()
          .when(field.id.value, "is", null)
          .then(sql`NULL`)
          .when(field.id.value, "=", "")
          .then(sql`NULL`)

        return {
          [tempField]: builder
            .else(
              previousField.isSingle
                ? eb
                    .selectFrom(userTable)
                    .select(users.username.name)
                    .where(eb(users.id.name, "=", sql.raw(field.id.value)))
                    .limit(1)
                : eb.fn("json_array", [
                    eb
                      .selectFrom(userTable)
                      .select(users.username.name)
                      .where(eb(users.id.name, "=", sql.raw(field.id.value)))
                      .limit(1),
                  ]),
            )
            .end(),
        }
      })
      .compile()
    this.changeType(field, "text", () => update)
  }
}
