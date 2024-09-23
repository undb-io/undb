import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { StringEmpty } from "../string-field"
import { PercentageFieldConstraint, percentageFieldConstraint } from "./percentage-field-constraint.vo"
import { percentageFieldValue, PercentageFieldValue } from "./percentage-field-value.vo"
import { percentageFieldAggregate } from "./percentage-field.aggregate"
import {
  createPercentageFieldCondition,
  type IPercentageFieldCondition,
  type IPercentageFieldConditionSchema,
} from "./percentage-field.condition"
import { PercentageEqual } from "./percentage-field.specification"

export const PERCENTAGE_TYPE = "percentage" as const

export const createPercentageFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(PERCENTAGE_TYPE),
  constraint: percentageFieldConstraint.optional(),
  defaultValue: percentageFieldValue.optional(),
})

export const createTablesPercentageFieldDTO = createPercentageFieldDTO

export type ICreatePercentageFieldDTO = z.infer<typeof createPercentageFieldDTO>

export const updatePercentageFieldDTO = createPercentageFieldDTO.setKey("id", fieldId)
export type IUpdatePercentageFieldDTO = z.infer<typeof updatePercentageFieldDTO>

export const percentageFieldDTO = baseFieldDTO.extend({
  type: z.literal(PERCENTAGE_TYPE),
  constraint: percentageFieldConstraint.optional(),
  defaultValue: percentageFieldValue.optional(),
})

export type IPercentageFieldDTO = z.infer<typeof percentageFieldDTO>

export class PercentageField extends AbstractField<PercentageFieldValue, PercentageFieldConstraint> {
  constructor(dto: IPercentageFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new PercentageFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new PercentageFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreatePercentageFieldDTO) {
    const field = new PercentageField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    if (dto.defaultValue) {
      field.defaultValue = new PercentageFieldValue(dto.defaultValue)
    }
    return field
  }

  override type = PERCENTAGE_TYPE

  override get #constraint(): PercentageFieldConstraint {
    return this.constraint.unwrapOrElse(() => new PercentageFieldConstraint({}))
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
    visitor.percentage(this)
  }

  override getSpec(condition: IPercentageFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new PercentageEqual(value, this.id))
      .with({ op: "neq" }, ({ value }) => new PercentageEqual(value, this.id).not())
      .with({ op: "is_empty" }, () => new StringEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new StringEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IPercentageFieldConditionSchema {
    return createPercentageFieldCondition(optionType)
  }

  override getMutationSpec(value: PercentageFieldValue): Option<RecordComositeSpecification> {
    return Some(new PercentageEqual(value.value ?? null, this.id))
  }

  override get aggregate() {
    return percentageFieldAggregate
  }
}
