import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { optionName } from "../../option"
import type { IOptionId } from "../../option/option-id.vo"

export const mutateSelectFieldValueSchema = optionName.nullable()

export type IMutateSelectFieldValueSchema = z.infer<typeof mutateSelectFieldValueSchema>

export class SelectFieldValue extends ValueObject<IOptionId> {
  constructor(option: IOptionId) {
    super({ value: option })
  }
  isEmpty() {
    return this.props.value === null || this.props.value === undefined
  }
}
