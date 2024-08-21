import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { colors, type IColors } from "../../colors"

export const formOption = z.object({
  backgroundColor: colors.optional(),
  autoAddNewField: z.boolean().optional(),
})

export type IFormOption = z.infer<typeof formOption>

export class FormOptionVO extends ValueObject<IFormOption> {
  static default() {
    return new this({})
  }

  public get backgroundColor() {
    return this.props.backgroundColor
  }

  public set backgroundColor(value: IColors | undefined) {
    this.props.backgroundColor = value
  }

  public get autoAddNewField() {
    return this.props.autoAddNewField
  }

  public set autoAddNewField(value: boolean | undefined) {
    this.props.autoAddNewField = value
  }

  toJSON() {
    return {
      backgroundColor: this.backgroundColor,
      autoAddNewField: this.autoAddNewField,
    }
  }
}
