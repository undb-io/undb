import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { fieldId, type Field } from "../../schema"
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
  public get fieldId() {
    return this.props.fieldId
  }

  public get hidden() {
    return this.props.hidden
  }

  public get required() {
    return this.props.required ?? false
  }

  public set required(value: boolean) {
    this.props.required = value
  }

  public getRequired(field: Field) {
    if (field.required) {
      return true
    }
    return this.props.required
  }

  public get condtion() {
    return this.props.condtion
  }

  static create(field: Field) {
    return new FormFieldVO({
      fieldId: field.id.value,
      hidden: false,
      required: field.required ?? false,
      condtion: undefined,
    })
  }

  toJSON() {
    return {
      fieldId: this.value.fieldId,
      hidden: this.value.hidden,
      required: this.value.required,
      condtion: this.value.condtion,
    }
  }
}
