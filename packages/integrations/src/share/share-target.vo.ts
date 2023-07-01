import { viewIdSchema } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const shareTargetSchema = z
  .object({
    type: z.literal('view'),
    id: viewIdSchema,
  })
  .nullable()

export type IShareTarget = z.infer<typeof shareTargetSchema>

export class ShareTarget extends ValueObject<IShareTarget> {
  public get id() {
    return this.unpack()?.id
  }

  public get type() {
    return this.unpack()?.type
  }
}
