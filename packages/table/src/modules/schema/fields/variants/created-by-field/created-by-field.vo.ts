import { Option, WontImplementException } from "@undb/domain"
import { z } from "@undb/zod"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractUserFieldMather } from "../abstractions"
import { abstractUserAggregate } from "../abstractions/abstract-user.aggregate"
import { CreatedByFieldValue } from "./created-by-field-value.vo"
import {
  createCreatedByFieldCondition,
  type ICreatedByFieldCondition,
  type ICreatedByFieldConditionSchema,
} from "./created-by-field.condition"

export const CREATED_BY_TYPE = "createdBy" as const

export const createCreatedByFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(CREATED_BY_TYPE),
})

export type ICreateCreatedByFieldDTO = z.infer<typeof createCreatedByFieldDTO>
export const updateCreatedByFieldDTO = createCreatedByFieldDTO.setKey("id", fieldId)
export type IUpdateCreatedByFieldDTO = z.infer<typeof updateCreatedByFieldDTO>

export const createdByFieldDTO = baseFieldDTO.extend({
  type: z.literal(CREATED_BY_TYPE),
})

export type ICreatedByFieldDTO = z.infer<typeof createdByFieldDTO>

export class CreatedByField extends AbstractField<CreatedByFieldValue> {
  constructor(dto: ICreatedByFieldDTO) {
    super(dto)
  }

  protected override system: boolean = true

  static create(dto: ICreateCreatedByFieldDTO) {
    return new CreatedByField({ ...dto, id: new FieldIdVo(CREATED_BY_TYPE).value })
  }

  override type = CREATED_BY_TYPE

  override get valueSchema() {
    return z.string().date()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.createdBy(this)
  }

  override getSpec(condition: ICreatedByFieldCondition) {
    const spec = createAbstractUserFieldMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): ICreatedByFieldConditionSchema {
    return createCreatedByFieldCondition(optionType)
  }

  override get aggregate() {
    return abstractUserAggregate
  }

  override getMutationSpec(value: CreatedByFieldValue): Option<RecordComositeSpecification> {
    throw new WontImplementException(CreatedByField.name + ".getMutationSpec")
  }
}
