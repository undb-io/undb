import { Option } from "@undb/domain"
import { z } from "zod"
import { createAbstractDateConditionMather, createUpdatedAtFieldCondition } from "../.."
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { UpdatedAtFieldValue } from "./updated-at-field-value.vo"
import { type IUpdatedAtFieldCondition, type IUpdatedAtFieldConditionSchema } from "./updated-at-field.condition"

export const UPDATED_AT_TYPE = "updatedAt" as const

export const createUpdatedAtFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(UPDATED_AT_TYPE),
})

export type ICreateUpdatedAtFieldDTO = z.infer<typeof createUpdatedAtFieldDTO>

export const updatedAtFieldDTO = baseFieldDTO.extend({
  type: z.literal(UPDATED_AT_TYPE),
})

export type IUpdatedAtFieldDTO = z.infer<typeof updatedAtFieldDTO>

export class UpdatedAtField extends AbstractField<UpdatedAtFieldValue> {
  constructor(dto: IUpdatedAtFieldDTO) {
    super(dto)
  }

  protected override system: boolean = true

  static create(dto: ICreateUpdatedAtFieldDTO) {
    return new UpdatedAtField({ ...dto, id: new FieldIdVo(UPDATED_AT_TYPE).value })
  }

  override type = UPDATED_AT_TYPE

  override get valueSchema() {
    if (this.required) {
      return z.string().min(1)
    }

    return z.string().optional()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.updatedAt(this)
  }

  override getSpec(condition: IUpdatedAtFieldCondition) {
    const spec = createAbstractDateConditionMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IUpdatedAtFieldConditionSchema {
    return createUpdatedAtFieldCondition(z.undefined())
  }
}
