import { z } from "@undb/zod"
import { uniqueTableDTO } from "../../../dto/unique-table.dto"
import { fieldId } from "../../schema"
import { recordId } from "../record"

export const getRecordByIdDTO = z
  .object({
    id: recordId,
    select: fieldId.array().optional(),
  })
  .merge(uniqueTableDTO)

export type IGetRecordByIdDTO = z.infer<typeof getRecordByIdDTO>
