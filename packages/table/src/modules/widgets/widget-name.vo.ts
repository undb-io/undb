import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const widgetName = z.string().min(2, { message: "widget name contains at least 2 chars" })

export type IWidgetName = z.infer<typeof widgetName>

export class WidgetNameVo extends ValueObject {
  constructor(value: string) {
    super({ value })
  }
}
