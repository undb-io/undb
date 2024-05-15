import { Option } from "@undb/domain"
import { z } from "zod"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { NumberFieldValue } from "./number-field-value.vo"
import { numberFieldFilter, type INumberFieldFilter, type INumberFieldFilterSchema } from "./number-field.filter"
import { createAbstractNumberFieldMather } from "../abstractions/abstract-number-field.filter"

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

  override getSpec(filter: INumberFieldFilter) {
    const spec = createAbstractNumberFieldMather(filter, this.id).exhaustive()

    return Option(spec)
  }

  protected override get filterSchema(): INumberFieldFilterSchema {
    return numberFieldFilter
  }
}
