import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const formulaFieldValue = z.any()
export type IFormulaFieldValue = z.infer<typeof formulaFieldValue>

export class FormulaFieldValue extends FieldValueObject<IFormulaFieldValue> {
  constructor(value: IFormulaFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
