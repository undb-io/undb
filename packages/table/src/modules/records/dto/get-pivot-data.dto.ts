import { z } from "@undb/zod"
import { uniqueTableDTO } from "../../../dto/unique-table.dto"
import { viewId } from "../../views"

export const getPivotDataDTO = z
  .object({
    viewId: viewId,
  })
  .merge(uniqueTableDTO)

export type IGetPivotDataDTO = z.infer<typeof getPivotDataDTO>
