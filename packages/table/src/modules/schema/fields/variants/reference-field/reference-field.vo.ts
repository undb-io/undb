import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { TableIdVo, tableId, type TableId } from "../../../../../table-id.vo"
import { recordId } from "../../../../records/record/record-id.vo"
import { FieldIdVo, fieldId, type FieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractNumberFieldMather } from "../abstractions"
import type { INumberFieldCondition } from "../number-field"
import { ReferenceFieldValue } from "./reference-field-value.vo"
import { referenceFieldAggregate } from "./reference-field.aggregate"
import { createReferenceFieldCondition, type IReferenceFieldConditionSchema } from "./reference-field.condition"

export const REFERENCE_TYPE = "reference" as const

export const createReferenceFieldDTO = createBaseFieldDTO
  .extend({
    type: z.literal(REFERENCE_TYPE),
    isOwner: z.boolean(),
    foreignTableId: tableId,
    symmetricFieldId: fieldId.optional(),
  })
  .omit({ display: true })

export type ICreateReferenceFieldDTO = z.infer<typeof createReferenceFieldDTO>
export const updateReferenceFieldDTO = createReferenceFieldDTO.setKey("id", fieldId).omit({ isOwner: true })
export type IUpdateReferenceFieldDTO = z.infer<typeof updateReferenceFieldDTO>

export const referenceFieldDTO = baseFieldDTO.extend({
  type: z.literal(REFERENCE_TYPE),
  isOwner: z.boolean(),
  foreignTableId: tableId,
  symmetricFieldId: fieldId.optional(),
})

export type IReferenceFieldDTO = z.infer<typeof referenceFieldDTO>

export class ReferenceField extends AbstractField<ReferenceFieldValue> {
  public readonly isOwner: boolean
  public readonly foreignTableId: TableId
  public readonly symmetricFieldId: Option<FieldId> = None

  constructor(dto: IReferenceFieldDTO) {
    super(dto)

    this.isOwner = dto.isOwner
    this.foreignTableId = new TableIdVo(dto.foreignTableId)
    if (dto.symmetricFieldId) {
      this.symmetricFieldId = Some(new FieldIdVo(dto.symmetricFieldId))
    }
    this.display = false
  }

  protected override system: boolean = true

  static create(dto: ICreateReferenceFieldDTO) {
    return new ReferenceField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = REFERENCE_TYPE

  override get valueSchema() {
    return recordId.array()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.reference(this)
  }

  override getSpec(condition: INumberFieldCondition) {
    const spec = createAbstractNumberFieldMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IReferenceFieldConditionSchema {
    return createReferenceFieldCondition(optionType)
  }

  override get aggregate() {
    return referenceFieldAggregate
  }
}
