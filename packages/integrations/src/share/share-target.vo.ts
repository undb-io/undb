import { formIdSchema, viewIdSchema } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

const shareTargetView = z.object({
  type: z.literal('view'),
  id: viewIdSchema,
})

const shareTargetForm = z.object({
  type: z.literal('form'),
  id: formIdSchema,
})

export const shareType = z.enum(['view', 'form'])
export type IShareType = z.infer<typeof shareType>

export const shareTargetSchema = z.discriminatedUnion('type', [shareTargetView, shareTargetForm])

export type IShareTarget = z.infer<typeof shareTargetSchema>

export class ShareTarget extends ValueObject<IShareTarget> {
  public get id() {
    return this.unpack()?.id
  }

  public get type() {
    return this.unpack()?.type
  }
}
