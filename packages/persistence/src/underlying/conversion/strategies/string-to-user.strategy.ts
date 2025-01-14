import type { Field } from "@undb/table"
import { getTableName } from "drizzle-orm"
import { sql } from "kysely"
import { users } from "../../../schema/sqlite"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class StringToUserStrategy extends UnderlyingConversionStrategy {
  convert(field: Field): void | Promise<void> {
    if (field.type !== "user") {
      return
    }

    const userTable = getTableName(users)

    const tempField = this.tempField(field)
    const update = this.qb
      .updateTable(this.table.id.value)
      .set((eb) => {
        return {
          [tempField]: eb
            .case()
            .when(field.id.value, "is", null)
            .then(sql`NULL`)
            .else(
              field.isSingle
                ? eb
                    .selectFrom(userTable)
                    .select(users.id.name)
                    .where(
                      eb.or([
                        eb(users.email.name, "=", sql.raw(field.id.value)),
                        eb(users.username.name, "=", sql.raw(field.id.value)),
                      ]),
                    )
                    .limit(1)
                : eb.fn("json_array", [
                    eb
                      .selectFrom(userTable)
                      .select(users.username.name)
                      .where(
                        eb.or([
                          eb(users.email.name, "=", sql.raw(field.id.value)),
                          eb(users.username.name, "=", sql.raw(field.id.value)),
                        ]),
                      ),
                  ]),
            )
            .end(),
        }
      })
      .compile()
    this.changeType(field, "text", () => update)
  }
}
