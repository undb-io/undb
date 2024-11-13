import { z } from "@undb/zod"
import { tableName } from "../../../table-name.vo"
import { fieldId } from "../../schema/fields/field-id.vo"
import { fieldName } from "../../schema/fields/field-name.vo"

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

export type IRecordTableMeta = z.infer<typeof recordEventTableMeta>
