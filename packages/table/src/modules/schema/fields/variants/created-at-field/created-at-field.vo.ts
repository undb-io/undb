import { Option } from "@undb/domain"
import { z } from "@undb/zod"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractDateConditionMather } from "../abstractions/abstract-date-field.condition"
import { abstractDateAggregate } from "../abstractions/abstract-date.aggregate"
import { CreatedAtFieldValue } from "./created-at-field-value.vo"
import {
  createCreatedAtFieldCondition,
  type ICreatedAtFieldCondition,
  type ICreatedAtFieldConditionSchema,
} from "./created-at-field.condition"

export const CREATED_AT_TYPE = "createdAt" as const

export const createCreatedAtFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(CREATED_AT_TYPE),
})

export type ICreateCreatedAtFieldDTO = z.infer<typeof createCreatedAtFieldDTO>
export const updateCreatedAtFieldDTO = createCreatedAtFieldDTO
export type IUpdateCreatedAtFieldDTO = ICreateCreatedAtFieldDTO

export const createdAtFieldDTO = baseFieldDTO.extend({
  type: z.literal(CREATED_AT_TYPE),
})

export type ICreatedAtFieldDTO = z.infer<typeof createdAtFieldDTO>

export class CreatedAtField extends AbstractField<CreatedAtFieldValue> {
  constructor(dto: ICreatedAtFieldDTO) {
    super(dto)
  }

  protected override system: boolean = true

  static create(dto: ICreateCreatedAtFieldDTO) {
    return new CreatedAtField({ ...dto, id: new FieldIdVo(CREATED_AT_TYPE).value })
  }

  override type = CREATED_AT_TYPE

  override get valueSchema() {
    return z.string().date()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.createdAt(this)
  }

  override getSpec(condition: ICreatedAtFieldCondition) {
    const spec = createAbstractDateConditionMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): ICreatedAtFieldConditionSchema {
    return createCreatedAtFieldCondition(optionType)
  }

  override get aggregate() {
    return abstractDateAggregate
  }
}
