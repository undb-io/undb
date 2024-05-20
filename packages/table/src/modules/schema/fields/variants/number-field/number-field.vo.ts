import { Option, Some } from "@undb/domain"
import { z } from "zod"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { NumberEqual } from "../abstractions"
import { createAbstractNumberFieldMather } from "../abstractions/abstract-number-field.condition"
import { NumberFieldValue } from "./number-field-value.vo"
import {
  createNumberFieldCondition,
  type INumberFieldCondition,
  type INumberFieldConditionSchema,
} from "./number-field.condition"

export const NUMBER_TYPE = "number" as const

export const createNumberFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(NUMBER_TYPE),
})

export type ICreateNumberFieldDTO = z.infer<typeof createNumberFieldDTO>

export const numberFieldDTO = baseFieldDTO.extend({
  type: z.literal(NUMBER_TYPE),
})

export type INumberFieldDTO = z.infer<typeof numberFieldDTO>

export class NumberField extends AbstractField<NumberFieldValue> {
  constructor(dto: INumberFieldDTO) {
    super(dto)
  }

  static create(dto: ICreateNumberFieldDTO) {
    return new NumberField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = NUMBER_TYPE

  override get valueSchema() {
    if (this.required) {
      return z.number()
    }

    return z.number().optional()
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
}
