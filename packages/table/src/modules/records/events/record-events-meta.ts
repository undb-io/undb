import { z } from "@undb/zod"
import { tableName } from "../../../table-name.vo"

export const recordEventTableMeta = z.object({
  name: tableName,
})

export type IReceventTableMeta = z.infer<typeof recordEventTableMeta>
