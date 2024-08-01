import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const formName = z.string().min(2, { message: "form name contains at least 2 chars" })

export type IFormName = z.infer<typeof formName>

export class FormNameVo extends ValueObject<IFormName> {
  constructor(value: string) {
    super({ value })
  }
}
