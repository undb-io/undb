import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { CheckboxFieldConstraint } from "./checkbox-field-constraint.vo"
import { CheckboxFieldValue } from "./checkbox-field-value.vo"
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
})

export type ICreateCheckboxFieldDTO = z.infer<typeof createCheckboxFieldDTO>
export const updateCheckboxFieldDTO = createCheckboxFieldDTO.setKey("id", fieldId)
export type IUpcheckboxCheckboxFieldDTO = z.infer<typeof updateCheckboxFieldDTO>

export const checkboxFieldDTO = baseFieldDTO.extend({
  type: z.literal(CHECKBOX_TYPE),
})

export type ICheckboxFieldDTO = z.infer<typeof checkboxFieldDTO>

export class CheckboxField extends AbstractField<CheckboxFieldValue> {
  constructor(dto: ICheckboxFieldDTO) {
    super(dto)
  }

  static create(dto: ICreateCheckboxFieldDTO) {
    return new CheckboxField({ ...dto, id: FieldIdVo.create().value })
  }

  override type = CHECKBOX_TYPE

  override get valueSchema() {
    return this.constraint.unwrapOrElse(() => new CheckboxFieldConstraint({})).schema
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
    return Some(new CheckboxEqual(value.value, this.id))
  }
}
