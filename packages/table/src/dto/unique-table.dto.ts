import { baseNameSchema } from "@undb/base"
import { z } from "@undb/zod"
import { tableId } from "../table-id.vo"
import { tableName } from "../table-name.vo"

export const uniqueTableDTO = z
  .object({
    tableId,
    baseName: baseNameSchema,
    tableName: tableName,
  })
  .partial()
// .superRefine((data, ctx) => {
//   if (!data.tableId && !data.baseName && !data.tableName) {
//     return ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ["uniqueTable"],
//       message: "At least one of tableId, baseName or tableName must be provided",
//     })
//   }
//   if (!data.tableId) {
//     if (!data.baseName || !data.tableName) {
//       return ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["uniqueTable"],
//         message: "both baseName and tableName must be provided when tableId is not provided",
//       })
//     }
//   }
// })

export type IUniqueTableDTO = z.infer<typeof uniqueTableDTO>
