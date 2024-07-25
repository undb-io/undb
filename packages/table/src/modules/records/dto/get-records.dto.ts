import { pagniationSchema } from "@undb/domain"
import { z } from "@undb/zod"
import { uniqueTableDTO } from "../../../dto/unique-table.dto"
import { fieldId } from "../../schema"
import { viewFilterGroup, viewId } from "../../views"

export const getRecordsDTO = z
  .object({
    viewId: viewId.optional(),
    q: z.string().optional(),
    filters: viewFilterGroup.optional(),
    select: fieldId.array().optional(),
    pagination: pagniationSchema.optional(),
  })
  .merge(uniqueTableDTO)

export type IGetRecordsDTO = z.infer<typeof getRecordsDTO>
