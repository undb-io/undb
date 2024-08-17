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

export const recordReadableValueDTO = z.record(fieldName, z.any())
export type IRecordReadableValueDTO = z.infer<typeof recordReadableValueDTO>

export const recordReadableDisplayValueDTO = z.record(fieldName, z.any())
export type IRecordReadableDisplayValueDTO = z.infer<typeof recordReadableDisplayValueDTO>

export const readableRecordDTO = z.object({
  id: recordId,
  values: recordReadableValueDTO,
  displayValues: recordReadableDisplayValueDTO.optional(),
})

export type IReadableRecordDTO = z.infer<typeof readableRecordDTO>
