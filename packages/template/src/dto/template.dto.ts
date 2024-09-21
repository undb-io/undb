import { baseNameSchema } from "@undb/base"
import { createFieldWithoutNameDTO } from "@undb/table"
import { z } from "@undb/zod"

export const templateDTO = z.object({
  name: baseNameSchema,
  tables: z.record(
    z.object({
      schema: z.record(createFieldWithoutNameDTO),
    }),
  ),
})

export type ITemplateDTO = z.infer<typeof templateDTO>
