import { Option } from "@undb/domain"
import { z } from "@undb/zod"
import { format } from "date-fns/fp"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractDateConditionMather } from "../abstractions/abstract-date-field.condition"
import { abstractDateAggregate } from "../abstractions/abstract-date.aggregate"
import { UpdatedAtFieldValue } from "./updated-at-field-value.vo"
import {
  createUpdatedAtFieldCondition,
  type IUpdatedAtFieldCondition,
  type IUpdatedAtFieldConditionSchema,
} from "./updated-at-field.condition"

export const UPDATED_AT_TYPE = "updatedAt" as const

export const createUpdatedAtFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(UPDATED_AT_TYPE),
})

export type ICreateUpdatedAtFieldDTO = z.infer<typeof createUpdatedAtFieldDTO>

export const updateUpdatedAtFieldDTO = createUpdatedAtFieldDTO.setKey("id", fieldId)
export type IUpdateUpdatedAtFieldDTO = z.infer<typeof updateUpdatedAtFieldDTO>

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
    return z.string().date()
  }

  get formatter() {
    return format("yyyy-MM-dd HH:mm:ss")
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.updatedAt(this)
  }

  override getSpec(condition: IUpdatedAtFieldCondition) {
    const spec = createAbstractDateConditionMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IUpdatedAtFieldConditionSchema {
    return createUpdatedAtFieldCondition(optionType)
  }

  override get aggregate() {
    return abstractDateAggregate
  }
}
