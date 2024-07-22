import { Option } from "@undb/domain"
import { z } from "@undb/zod"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractNumberFieldMather } from "../abstractions"
import type { INumberFieldCondition } from "../number-field"
import { AutoIncrementFieldValue } from "./autoincrement-field-value.vo"
import {
  createAutoIncrementFieldCondition,
  type IAutoIncrementFieldConditionSchema,
} from "./autoincrement-field.condition"

export const AUTO_INCREMENT_TYPE = "autoIncrement" as const

export const createAutoIncrementFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(AUTO_INCREMENT_TYPE),
})

export type ICreateAutoIncrementFieldDTO = z.infer<typeof createAutoIncrementFieldDTO>
export const updateAutoIncrementFieldDTO = createAutoIncrementFieldDTO.setKey("id", fieldId)
export type IUpdateAutoIncrementFieldDTO = z.infer<typeof updateAutoIncrementFieldDTO>

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
    return z.number()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.autoIncrement(this)
  }

  override getSpec(condition: INumberFieldCondition) {
    const spec = createAbstractNumberFieldMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IAutoIncrementFieldConditionSchema {
    return createAutoIncrementFieldCondition(optionType)
  }

  override get aggregate() {
    return z.undefined()
  }
}
