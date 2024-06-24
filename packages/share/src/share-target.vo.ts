import { ValueObject } from "@undb/domain"
import { formId, viewId } from "@undb/table"
import { z } from "zod"

const shareTargetView = z.object({
  type: z.literal("view"),
  id: viewId,
})

const shareTargetForm = z.object({
  type: z.literal("form"),
  id: formId,
})

export const shareType = z.enum(["view", "form"])
export type IShareType = z.infer<typeof shareType>

export const shareTargetSchema = z.discriminatedUnion("type", [shareTargetView, shareTargetForm])

export type IShareTarget = z.infer<typeof shareTargetSchema>

export class ShareTarget extends ValueObject<IShareTarget> {
  public get id() {
    return this.unpack()?.id
  }

  public get type() {
    return this.unpack()?.type
  }

  public toJSON() {
    return {
      id: this.id,
      type: this.type,
    }
  }
}
