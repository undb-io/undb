import { Option } from "@undb/domain"
import { z } from "zod"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractNumberFieldMather } from "../abstractions"
import type { INumberFieldFilter } from "../number-field"
import { AutoIncrementFieldValue } from "./autoincrement-field-value.vo"
import { autoIncrementFieldFilter, type IAutoIncrementFieldFilterSchema } from "./autoincrement-field.filter"

export const AUTO_INCREMENT_TYPE = "autoIncrement" as const

export const createAutoIncrementFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(AUTO_INCREMENT_TYPE),
})

export type ICreateAutoIncrementFieldDTO = z.infer<typeof createAutoIncrementFieldDTO>

export const autoIncrementFieldDTO = baseFieldDTO.extend({
  type: z.literal(AUTO_INCREMENT_TYPE),
})

export type IAutoIncrementFieldDTO = z.infer<typeof autoIncrementFieldDTO>

export class AutoIncrementField extends AbstractField<AutoIncrementFieldValue> {
  constructor(dto: IAutoIncrementFieldDTO) {
    super(dto)
  }

  protected override system: boolean = true

  static create(dto: ICreateAutoIncrementFieldDTO) {
    return new AutoIncrementField({ ...dto, id: new FieldIdVo(AUTO_INCREMENT_TYPE).value })
  }

  override type = AUTO_INCREMENT_TYPE

  override get valueSchema() {
    if (this.required) {
      return z.string().min(1)
    }

    return z.string().optional()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.autoIncrement(this)
  }

  override getSpec(filter: INumberFieldFilter) {
    const spec = createAbstractNumberFieldMather(filter, this.id).exhaustive()

    return Option(spec)
  }

  protected override get filterSchema(): IAutoIncrementFieldFilterSchema {
    return autoIncrementFieldFilter
  }
}
