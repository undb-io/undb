import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { CheckboxFieldConstraint } from "./checkbox-field-constraint.vo"
import { checkboxFieldValue, CheckboxFieldValue } from "./checkbox-field-value.vo"
import { checkboxFieldAggregate } from "./checkbox-field.aggregate"
import {
  createCheckboxFieldCondition,
  type ICheckboxFieldCondition,
  type ICheckboxFieldConditionSchema,
} from "./checkbox-field.condition"
import { CheckboxEqual } from "./checkbox-field.specification"

export const CHECKBOX_TYPE = "checkbox" as const

export const createCheckboxFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(CHECKBOX_TYPE),
  defaultValue: checkboxFieldValue.optional().nullable(),
})

export const createTablesCheckboxFieldDTO = createCheckboxFieldDTO

export type ICreateCheckboxFieldDTO = z.infer<typeof createCheckboxFieldDTO>
export const updateCheckboxFieldDTO = createCheckboxFieldDTO.setKey("id", fieldId)
export type IUpcheckboxCheckboxFieldDTO = z.infer<typeof updateCheckboxFieldDTO>

export const checkboxFieldDTO = baseFieldDTO.extend({
  type: z.literal(CHECKBOX_TYPE),
  defaultValue: checkboxFieldValue.optional().nullable(),
})

export type ICheckboxFieldDTO = z.infer<typeof checkboxFieldDTO>

export class CheckboxField extends AbstractField<CheckboxFieldValue> {
  constructor(dto: ICheckboxFieldDTO) {
    super(dto)
    if (typeof dto.defaultValue === "boolean") {
      this.defaultValue = new CheckboxFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateCheckboxFieldDTO) {
    return new CheckboxField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = CHECKBOX_TYPE

  get #constraint(): CheckboxFieldConstraint {
    return this.constraint.unwrapOrElse(() => new CheckboxFieldConstraint({}))
  }

  override get valueSchema() {
    return this.#constraint.schema
  }

  override get mutateSchema() {
    return this.#constraint.mutateSchema
  }

  override getConstraintFromFormField(formField: FormFieldVO) {
    return this.#constraint.fromFormField(formField)
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.checkbox(this)
  }

  override getSpec(condition: ICheckboxFieldCondition) {
    const spec = match(condition)
      .with({ op: "is_true" }, () => new CheckboxEqual(true, this.id))
      .with({ op: "is_false" }, () => new CheckboxEqual(false, this.id))
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): ICheckboxFieldConditionSchema {
    return createCheckboxFieldCondition(optionType)
  }

  override get aggregate() {
    return checkboxFieldAggregate
  }

  override getMutationSpec(value: CheckboxFieldValue): Option<RecordComositeSpecification> {
    return Some(new CheckboxEqual(!!value.value, this.id))
  }
}
