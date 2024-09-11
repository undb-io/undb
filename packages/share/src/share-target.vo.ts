import { baseIdSchema } from "@undb/base"
import { ValueObject } from "@undb/domain"
import { formId,tableId,viewId } from "@undb/table"
import { z } from "zod"

const shareTargetView = z.object({
  type: z.literal("view"),
  id: viewId,
})

const shareTargetForm = z.object({
  type: z.literal("form"),
  id: formId,
})

const shareTargetTable = z.object({
  type: z.literal("table"),
  id: tableId,
})

const shareTargetBase = z.object({
  type: z.literal("base"),
  id: baseIdSchema,
})

export const shareType = z.enum(["view", "form", "table", "base"])
export type IShareType = z.infer<typeof shareType>

export const shareTargetSchema = z.discriminatedUnion("type", [
  shareTargetView,
  shareTargetForm,
  shareTargetTable,
  shareTargetBase,
])

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
