import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { NumberEqual } from "../abstractions"
import { createAbstractNumberFieldMather } from "../abstractions/abstract-number-field.condition"
import { abstractNumberAggregate } from "../abstractions/abstract-number.aggregate"
import { NumberFieldConstraint, numberFieldConstraint } from "./number-field-constraint.vo"
import { NumberFieldValue } from "./number-field-value.vo"
import {
  createNumberFieldCondition,
  type INumberFieldCondition,
  type INumberFieldConditionSchema,
} from "./number-field.condition"

export const NUMBER_TYPE = "number" as const

export const createNumberFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(NUMBER_TYPE),
  constraint: numberFieldConstraint.optional(),
})

export type ICreateNumberFieldDTO = z.infer<typeof createNumberFieldDTO>

export const numberFieldDTO = baseFieldDTO.extend({
  type: z.literal(NUMBER_TYPE),
  constraint: numberFieldConstraint.optional(),
})

export type INumberFieldDTO = z.infer<typeof numberFieldDTO>

export class NumberField extends AbstractField<NumberFieldValue, NumberFieldConstraint> {
  constructor(dto: INumberFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new NumberFieldConstraint(dto.constraint))
    }
  }

  static create(dto: ICreateNumberFieldDTO) {
    return new NumberField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = NUMBER_TYPE

  override get valueSchema() {
    return this.constraint.unwrapOrElse(() => new NumberFieldConstraint({})).schema
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.number(this)
  }

  override getSpec(condition: INumberFieldCondition) {
    const spec = createAbstractNumberFieldMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  override updateValue(value: NumberFieldValue): Option<RecordComositeSpecification> {
    return Some(new NumberEqual(value.value, this.id))
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): INumberFieldConditionSchema {
    return createNumberFieldCondition(optionType)
  }

  override get aggregates() {
    return abstractNumberAggregate
  }
}
