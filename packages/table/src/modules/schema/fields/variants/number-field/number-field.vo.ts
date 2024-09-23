import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { NumberEqual } from "../abstractions"
import { createAbstractNumberFieldMather } from "../abstractions/abstract-number-field.condition"
import { abstractNumberAggregate } from "../abstractions/abstract-number.aggregate"
import { NumberFieldConstraint, numberFieldConstraint } from "./number-field-constraint.vo"
import { NumberFieldValue, numberFieldValueSchema } from "./number-field-value.vo"
import {
  createNumberFieldCondition,
  type INumberFieldCondition,
  type INumberFieldConditionSchema,
} from "./number-field.condition"

export const NUMBER_TYPE = "number" as const

export const createNumberFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(NUMBER_TYPE),
  constraint: numberFieldConstraint.optional(),
  defaultValue: numberFieldValueSchema,
})

export const createTablesNumberFieldDTO = createNumberFieldDTO

export type ICreateNumberFieldDTO = z.infer<typeof createNumberFieldDTO>

export const updateNumberFieldDTO = createNumberFieldDTO.setKey("id", fieldId)
export type IUpdateNumberFieldDTO = z.infer<typeof updateNumberFieldDTO>

export const numberFieldDTO = baseFieldDTO.extend({
  type: z.literal(NUMBER_TYPE),
  constraint: numberFieldConstraint.optional(),
  defaultValue: numberFieldValueSchema,
})

export type INumberFieldDTO = z.infer<typeof numberFieldDTO>

export class NumberField extends AbstractField<NumberFieldValue, NumberFieldConstraint> {
  constructor(dto: INumberFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new NumberFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new NumberFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateNumberFieldDTO) {
    const field = new NumberField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    if (dto.defaultValue) {
      field.defaultValue = new NumberFieldValue(dto.defaultValue)
    }
    return field
  }

  override type = NUMBER_TYPE

  get #constraint(): NumberFieldConstraint {
    return this.constraint.unwrapOrElse(() => new NumberFieldConstraint({}))
  }

  get max() {
    return this.#constraint.props.max
  }

  get min() {
    return this.#constraint.props.min
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
    visitor.number(this)
  }

  override getSpec(condition: INumberFieldCondition) {
    const spec = createAbstractNumberFieldMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): INumberFieldConditionSchema {
    return createNumberFieldCondition(optionType)
  }

  override getMutationSpec(value: NumberFieldValue): Option<RecordComositeSpecification> {
    return Some(new NumberEqual(value.value ?? null, this.id))
  }

  override get aggregate() {
    return abstractNumberAggregate
  }
}
