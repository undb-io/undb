import type { z } from "zod"
import { recordDTO } from "../record/dto"

export const recordsDTO = recordDTO.array()

export type IRecordsDTO = z.infer<typeof recordsDTO>
