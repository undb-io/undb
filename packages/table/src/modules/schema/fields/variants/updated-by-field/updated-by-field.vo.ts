import { Option } from "@undb/domain"
import { z } from "@undb/zod"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractUserFieldMather } from "../abstractions"
import { abstractUserAggregate } from "../abstractions/abstract-user.aggregate"
import { UpdatedByFieldValue } from "./updated-by-field-value.vo"
import {
  createUpdatedByFieldCondition,
  type IUpdatedByFieldCondition,
  type IUpdatedByFieldConditionSchema,
} from "./updated-by-field.condition"

export const UPDATED_BY_TYPE = "updatedBy" as const

export const createUpdatedByFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(UPDATED_BY_TYPE),
})

export type ICreateUpdatedByFieldDTO = z.infer<typeof createUpdatedByFieldDTO>
export const updateUpdatedByFieldDTO = createUpdatedByFieldDTO.setKey("id", fieldId)
export type IUpdateUpdatedByFieldDTO = z.infer<typeof updateUpdatedByFieldDTO>

export const updatedByFieldDTO = baseFieldDTO.extend({
  type: z.literal(UPDATED_BY_TYPE),
})

export type IUpdatedByFieldDTO = z.infer<typeof updatedByFieldDTO>

export class UpdatedByField extends AbstractField<UpdatedByFieldValue> {
  constructor(dto: IUpdatedByFieldDTO) {
    super(dto)
  }

  protected override system: boolean = true

  static create(dto: ICreateUpdatedByFieldDTO) {
    return new UpdatedByField({ ...dto, id: new FieldIdVo(UPDATED_BY_TYPE).value })
  }

  override type = UPDATED_BY_TYPE

  override get valueSchema() {
    return z.string().date()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.updatedBy(this)
  }

  override getSpec(condition: IUpdatedByFieldCondition) {
    const spec = createAbstractUserFieldMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IUpdatedByFieldConditionSchema {
    return createUpdatedByFieldCondition(optionType)
  }

  override get aggregate() {
    return abstractUserAggregate
  }
}
