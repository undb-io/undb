import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const tableName = z
  .string()
  .min(2, { message: "table name contains at least 2 chars" })
  .regex(/^[^\s]*$/, "Table name cannot contain spaces")

export type ITableName = z.infer<typeof tableName>

export class TableNameVo extends ValueObject {
  constructor(value: string) {
    super({ value: tableName.parse(value) })
  }
}
