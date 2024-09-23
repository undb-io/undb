import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { NumberGT, NumberGTE, NumberLT, NumberLTE } from "../abstractions/abstract-number-value.specification"
import { StringEmpty } from "../string-field"
import { DurationFieldConstraint, durationFieldConstraint } from "./duration-field-constraint.vo"
import { durationFieldValue, DurationFieldValue } from "./duration-field-value.vo"
import { durationFieldAggregate } from "./duration-field.aggregate"
import {
  createDurationFieldCondition,
  type IDurationFieldCondition,
  type IDurationFieldConditionSchema,
} from "./duration-field.condition"
import { DurationEqual } from "./duration-field.specification"

export const DURATION_TYPE = "duration" as const

export const createDurationFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(DURATION_TYPE),
  constraint: durationFieldConstraint.optional(),
  defaultValue: durationFieldValue.optional(),
})

export const createTablesDurationFieldDTO = createDurationFieldDTO

export type ICreateDurationFieldDTO = z.infer<typeof createDurationFieldDTO>

export const updateDurationFieldDTO = createDurationFieldDTO.setKey("id", fieldId)
export type IUpdateDurationFieldDTO = z.infer<typeof updateDurationFieldDTO>

export const durationFieldDTO = baseFieldDTO.extend({
  type: z.literal(DURATION_TYPE),
  constraint: durationFieldConstraint.optional(),
  defaultValue: durationFieldValue.optional(),
})

export type IDurationFieldDTO = z.infer<typeof durationFieldDTO>

export class DurationField extends AbstractField<DurationFieldValue, DurationFieldConstraint> {
  constructor(dto: IDurationFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new DurationFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new DurationFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateDurationFieldDTO) {
    const field = new DurationField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    if (dto.defaultValue) {
      field.defaultValue = new DurationFieldValue(dto.defaultValue)
    }
    return field
  }

  override type = DURATION_TYPE

  override get #constraint(): DurationFieldConstraint {
    return this.constraint.unwrapOrElse(() => new DurationFieldConstraint({}))
  }

  get symbol() {
    return this.option.unwrapOrElse(() => ({ symbol: "$" })).symbol
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
    visitor.duration(this)
  }

  override getSpec(condition: IDurationFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new DurationEqual(value, this.id))
      .with({ op: "neq" }, ({ value }) => new DurationEqual(value, this.id).not())
      .with({ op: "gt" }, ({ value }) => new NumberGT(value, this.id))
      .with({ op: "gte" }, ({ value }) => new NumberGTE(value, this.id))
      .with({ op: "lt" }, ({ value }) => new NumberLT(value, this.id))
      .with({ op: "lte" }, ({ value }) => new NumberLTE(value, this.id))
      .with({ op: "is_empty" }, () => new StringEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new StringEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IDurationFieldConditionSchema {
    return createDurationFieldCondition(optionType)
  }

  override getMutationSpec(value: DurationFieldValue): Option<RecordComositeSpecification> {
    return Some(new DurationEqual(value.value ?? null, this.id))
  }

  override get aggregate() {
    return durationFieldAggregate
  }
}
