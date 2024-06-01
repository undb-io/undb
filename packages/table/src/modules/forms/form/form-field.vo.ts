import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { fieldId, type Field } from "../../schema"
import { createConditionGroup, isEmptyConditionGroup } from "../../schema/fields/condition"

const formFieldConditionOption = z.undefined()

const formFieldCondition = createConditionGroup(formFieldConditionOption, formFieldConditionOption)

export const formField = z.object({
  fieldId,
  defaultValue: z.any().optional(),
  hidden: z.boolean().optional(),
  required: z.boolean().optional(),
  conditionEnabled: z.boolean().optional(),
  condition: formFieldCondition.optional(),
})

export type IFormField = z.infer<typeof formField>

export class FormFieldVO extends ValueObject<IFormField> {
  public get fieldId() {
    return this.props.fieldId
  }

  public get hidden() {
    if (this.required) {
      return false
    }
    return this.props.hidden ?? false
  }

  public get defaultValue() {
    return this.props.defaultValue
  }

  public set defaultValue(value: any) {
    this.props.defaultValue = value
  }

  public set hidden(value: boolean) {
    this.props.hidden = value
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

  public get conditionEnabled() {
    return this.props.conditionEnabled ?? false
  }

  public set conditionEnabled(value: boolean) {
    this.props.conditionEnabled = value
  }

  public get condition() {
    return this.props.condition
  }

  public set condition(value: IFormField["condition"]) {
    this.props.condition = value
  }

  public get hasCondition() {
    return !!this.condition && !isEmptyConditionGroup(this.condition)
  }

  public toggleVisibility(field: Field): FormFieldVO {
    let hidden = this.hidden
    if (!this.getRequired(field)) {
      hidden = !hidden
    } else {
      hidden = false
    }
    return new FormFieldVO({ ...this.props, hidden })
  }

  static create(field: Field) {
    return new FormFieldVO({
      fieldId: field.id.value,
      hidden: false,
      required: field.required ?? false,
      conditionEnabled: false,
      condition: undefined,
    })
  }

  toJSON() {
    const props = this.props
    return {
      fieldId: props.fieldId,
      hidden: props.hidden,
      required: props.required,
      defaultValue: props.defaultValue,
      conditionEnabled: props.conditionEnabled,
      condition: props.condition,
    }
  }
}
