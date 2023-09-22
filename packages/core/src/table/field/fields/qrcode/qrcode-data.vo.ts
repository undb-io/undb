import { ValueObject } from '@undb/domain'
import { z } from 'zod'
import { fieldIdSchema } from '../../value-objects'

export const qrcodeDataSchema = z.object({
  displayRecordURL: z.boolean().optional(),
  dataFieldId: fieldIdSchema.optional(),
})

export type IQRCodeData = z.infer<typeof qrcodeDataSchema>

export class QRCodeData extends ValueObject<IQRCodeData> {
  constructor(data: IQRCodeData) {
    if (data.displayRecordURL) {
      data.dataFieldId = undefined
    }
    if (data.dataFieldId) {
      data.displayRecordURL = false
    }
    if (!data.dataFieldId && !data.displayRecordURL) {
      data.displayRecordURL = true
    }
    super(data)
  }
}
