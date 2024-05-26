import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { fieldId } from "../../schema"
import { createConditionGroup } from "../../schema/fields/condition"

const formFieldConditionOption = z.undefined()

const formFieldCondition = createConditionGroup(formFieldConditionOption, formFieldConditionOption)

export const formField = z.object({
  fieldId,
  hidden: z.boolean().optional(),
  required: z.boolean().optional(),
  condtion: formFieldCondition.optional(),
})

export type IFormField = z.infer<typeof formField>

export class FormFieldVO extends ValueObject<IFormField> {
  toJSON() {
    return {
      fieldId: this.value.fieldId,
      hidden: this.value.hidden,
      required: this.value.required,
      condtion: this.value.condtion,
    }
  }
}
