import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { createConditionGroup } from "../../schema/fields/condition/condition.type"
import { conditionWithoutFields, isEmptyConditionGroup } from "../../schema/fields/condition/condition.util"
import { fieldId } from "../../schema/fields/field-id.vo"
import type { Field } from "../../schema/fields/field.type"

const formFieldConditionOption = z.undefined()

const formFieldCondition = createConditionGroup(formFieldConditionOption, formFieldConditionOption)

export const formField = z.object({
  fieldId: fieldId,
  defaultValue: z.any().optional(),
  hidden: z.boolean().optional(),
  required: z.boolean().optional(),
  conditionEnabled: z.boolean().optional(),
  condition: formFieldCondition.optional(),
})

export type IFormField = z.infer<typeof formField>

export const createFormField = formField

export type ICreateFormField = z.infer<typeof createFormField>

export class FormFieldVO extends ValueObject<IFormField> {
  public get fieldId() {
    return this.props.fieldId
  }

  public get hidden() {
    return this.props.hidden ?? false
  }

  public get defaultValue() {
    return this.props.defaultValue
  }

  public set defaultValue(value: any) {
    this.props.defaultValue = value
    if ((value === null || value === undefined) && this.required) {
      this.hidden = false
    }
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

  public setRequired(field: Field, value: boolean) {
    if (field.required) {
      this.required = true
    } else {
      this.required = value
    }
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

  public show(field: Field): FormFieldVO {
    let hidden = false
    if (field.type === "button") {
      hidden = true
    }
    return new FormFieldVO({ ...this.props, hidden })
  }

  public hide(field: Field): FormFieldVO {
    return new FormFieldVO({ ...this.props, hidden: true })
  }

  public deleteField(field: Field): FormFieldVO {
    if (this.condition) {
      return new FormFieldVO({
        ...this.props,
        condition: conditionWithoutFields(this.condition, new Set([field.id.value])),
      })
    }
    return this
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

  static create(
    field: Field,
    { hidden, conditionEnabled, condition, required, defaultValue }: Omit<ICreateFormField, "fieldId"> = {},
  ) {
    // TODO: allow button field to be shown in future
    if (field.type === "button") {
      hidden = true
    }

    return new FormFieldVO({
      fieldId: field.id.value,
      defaultValue,
      hidden,
      required: field.required ?? required ?? false,
      conditionEnabled: typeof conditionEnabled === "boolean" ? conditionEnabled : !!condition,
      condition,
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
