import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { colors, type IColors } from "../../colors"

export const formOption = z.object({
  backgroundColor: colors.optional(),
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

  toJSON() {
    return {
      backgroundColor: this.backgroundColor,
    }
  }
}
