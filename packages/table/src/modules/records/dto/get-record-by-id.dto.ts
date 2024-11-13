import { z } from "@undb/zod"
import { uniqueTableDTO } from "../../../dto/unique-table.dto"
import { fieldId } from "../../schema/fields/field-id.vo"
import { viewId } from "../../views/view/view-id.vo"
import { viewName } from "../../views/view/view-name.vo"
import { recordId } from "../record"

export const getRecordByIdDTO = z
  .object({
    id: recordId,
    select: fieldId.array().optional(),
    viewId: viewId.optional(),
    viewName: viewName.optional(),
    ignoreView: z.boolean().optional(),
  })
  .merge(uniqueTableDTO)

export type IGetRecordByIdDTO = z.infer<typeof getRecordByIdDTO>
