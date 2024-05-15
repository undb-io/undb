import { Option } from "@undb/domain"
import { match } from "ts-pattern"
import { z } from "zod"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import {
  NumberEmpty,
  NumberEqual,
  NumberGT,
  NumberGTE,
  NumberLT,
  NumberLTE,
} from "../abstractions/abstract-number-value.specification"
import { NumberFieldValue } from "./number-field-value.vo"
import { numberFieldFilter, type INumberFieldFilter, type INumberFieldFilterSchema } from "./number-field.filter"

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
    const spec = match(filter)
      .with({ op: "eq" }, ({ value }) => new NumberEqual(value, this.id))
      .with({ op: "neq" }, ({ value }) => new NumberEqual(value, this.id).not())
      .with({ op: "gt" }, ({ value }) => new NumberGT(value, this.id))
      .with({ op: "gte" }, ({ value }) => new NumberGTE(value, this.id))
      .with({ op: "lt" }, ({ value }) => new NumberLT(value, this.id))
      .with({ op: "lte" }, ({ value }) => new NumberLTE(value, this.id))
      .with({ op: "is_empty" }, () => new NumberEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new NumberEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override get filterSchema(): INumberFieldFilterSchema {
    return numberFieldFilter
  }
}
