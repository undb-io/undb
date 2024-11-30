import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractNumberFieldMather } from "../abstractions/abstract-number-field.condition"
import { abstractNumberAggregate } from "../abstractions/abstract-number.aggregate"
import { RatingFieldConstraint, ratingFieldConstraint } from "./rating-field-constraint.vo"
import { RatingFieldValue, ratingFieldValueSchema } from "./rating-field-value.vo"
import {
  createRatingFieldCondition,
  type IRatingFieldCondition,
  type IRatingFieldConditionSchema,
} from "./rating-field.condition"
import { RatingEqual } from "./rating-field.specification"

const DEFAULT_RATING_MAX = 5

export const RATING_TYPE = "rating" as const

export const createRatingFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(RATING_TYPE),
  constraint: ratingFieldConstraint.optional(),
  defaultValue: ratingFieldValueSchema,
})

export const createTablesRatingFieldDTO = createRatingFieldDTO

export type ICreateRatingFieldDTO = z.infer<typeof createRatingFieldDTO>

export const updateRatingFieldDTO = createRatingFieldDTO.setKey("id", fieldId)
export type IUpdateRatingFieldDTO = z.infer<typeof updateRatingFieldDTO>

export const ratingFieldDTO = baseFieldDTO.extend({
  type: z.literal(RATING_TYPE),
  constraint: ratingFieldConstraint.optional(),
  defaultValue: ratingFieldValueSchema,
})

export type IRatingFieldDTO = z.infer<typeof ratingFieldDTO>

export class RatingField extends AbstractField<RatingFieldValue, RatingFieldConstraint> {
  constructor(dto: IRatingFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new RatingFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new RatingFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateRatingFieldDTO) {
    const field = new RatingField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    if (dto.defaultValue) {
      field.defaultValue = new RatingFieldValue(dto.defaultValue)
    }
    return field
  }

  override type = RATING_TYPE

  get #constraint(): RatingFieldConstraint {
    return this.constraint.unwrapOrElse(() => new RatingFieldConstraint({}))
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
    visitor.rating(this)
  }

  override getSpec(condition: IRatingFieldCondition) {
    const spec = createAbstractNumberFieldMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IRatingFieldConditionSchema {
    return createRatingFieldCondition(optionType)
  }

  override getMutationSpec(value: RatingFieldValue): Option<RecordComositeSpecification> {
    return Some(new RatingEqual(value.value ?? null, this.id))
  }

  override get aggregate() {
    return abstractNumberAggregate
  }

  public get max() {
    return this.constraint.mapOr(DEFAULT_RATING_MAX, (c) => c.props.max || DEFAULT_RATING_MAX)
  }

  public get min() {
    return 0
  }
}
