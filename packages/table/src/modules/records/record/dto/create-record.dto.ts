import { z } from "@undb/zod"
import { recordId } from "../record-id.vo"
import { recordValues } from "../record-values.vo"

export const createRecordDTO = z.object({
  id: recordId.optional().nullable(),
  values: recordValues,
})

export type ICreateRecordDTO = z.infer<typeof createRecordDTO>

export const flattenCreateRecordDTO = recordValues

export type IFlattenCreateRecordDTO = z.infer<typeof flattenCreateRecordDTO>

export function flattenToCreateRecordDTO(dto: IFlattenCreateRecordDTO): ICreateRecordDTO {
  const { id, ...values } = dto
  return {
    id,
    values,
  }
}
