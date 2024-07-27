import { z } from "@undb/zod"
import { tableName } from "../../../table-name.vo"
import { fieldId, fieldName } from "../../schema"

export const recordEventTableMeta = z.object({
  name: tableName,
  fields: z.record(
    fieldName,
    z.object({
      id: fieldId,
      type: z.string(),
    }),
  ),
})

export type IReceventTableMeta = z.infer<typeof recordEventTableMeta>
