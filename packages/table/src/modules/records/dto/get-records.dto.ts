import { pagniationSchema } from "@undb/domain"
import { z } from "@undb/zod"
import { uniqueTableDTO } from "../../../dto/unique-table.dto"
import { fieldId } from "../../schema/fields/field-id.vo"
import { viewFilterGroup, viewId, viewName } from "../../views"

export const getRecordsDTO = z
  .object({
    viewName: viewName.optional(),
    viewId: viewId.optional(),
    ignoreView: z.boolean().optional(),
    q: z.string().optional(),
    filters: viewFilterGroup.optional(),
    select: fieldId.array().optional(),
    pagination: pagniationSchema.optional(),
  })
  .merge(uniqueTableDTO)

export type IGetRecordsDTO = z.infer<typeof getRecordsDTO>
