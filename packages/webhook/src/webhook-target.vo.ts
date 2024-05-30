import { ValueObject } from "@undb/domain"
import { recordEvents, tableId } from "@undb/table"
import { z } from "zod"

export const webhookTargetSchema = z
  .object({
    type: z.literal("table"),
    id: tableId,
    event: z.enum(recordEvents),
  })
  .nullable()

export type IWebhookTarget = z.infer<typeof webhookTargetSchema>

export class WebhookTarget extends ValueObject<IWebhookTarget> {
  public get id() {
    return this.unpack()!.id
  }

  public get type() {
    return this.value!.type
  }

  public get event() {
    return this.unpack()!.event
  }

  toJSON(): IWebhookTarget {
    return {
      type: this.type,
      id: this.id,
      event: this.event,
    }
  }
}
