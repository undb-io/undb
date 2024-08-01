import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const viewName = z.string().min(2, { message: "view name contains at least 2 chars" })

export type IViewName = z.infer<typeof viewName>

export class ViewNameVo extends ValueObject {
  constructor(value: string) {
    super({ value })
  }
}
