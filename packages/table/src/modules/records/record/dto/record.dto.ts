import { z } from "@undb/zod"
import { fieldName } from "../../../schema"
import { recordDisplayValues } from "../record-display-values.vo"
import { recordId } from "../record-id.vo"
import { recordValues } from "../record-values.vo"

export const recordDTO = z.object({
  id: recordId,
  values: recordValues,
  displayValues: recordDisplayValues.optional(),
})

export type IRecordDTO = z.infer<typeof recordDTO>

export const recordReadableDTO = z.record(fieldName, z.any())

export type IRecordReadableDTO = z.infer<typeof recordReadableDTO>
