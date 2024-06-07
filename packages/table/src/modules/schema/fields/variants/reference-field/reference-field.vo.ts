import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { tableId } from "../../../../../table-id.vo"
import type { TableDo } from "../../../../../table.do"
import { recordId } from "../../../../records/record/record-id.vo"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractNumberFieldMather } from "../abstractions"
import type { INumberFieldCondition } from "../number-field"
import { ReferenceFieldValue } from "./reference-field-value.vo"
import { referenceFieldAggregate } from "./reference-field.aggregate"
import { createReferenceFieldCondition, type IReferenceFieldConditionSchema } from "./reference-field.condition"

export const REFERENCE_TYPE = "reference" as const

const referenceFieldOption = z.object({
  isOwner: z.boolean(),
  foreignTableId: tableId,
  symmetricFieldId: fieldId.optional(),
})

export type IReferenceFieldOption = z.infer<typeof referenceFieldOption>

export const createReferenceFieldDTO = createBaseFieldDTO
  .extend({
    type: z.literal(REFERENCE_TYPE),
    option: z.object({
      foreignTableId: tableId,
      createSymmetricField: z.boolean(),
    }),
  })
  .omit({ display: true })

export type ICreateReferenceFieldDTO = z.infer<typeof createReferenceFieldDTO>
export const updateReferenceFieldDTO = createReferenceFieldDTO.setKey("id", fieldId)
export type IUpdateReferenceFieldDTO = z.infer<typeof updateReferenceFieldDTO>

export const referenceFieldDTO = baseFieldDTO.extend({
  type: z.literal(REFERENCE_TYPE),
  option: referenceFieldOption,
})

export type IReferenceFieldDTO = z.infer<typeof referenceFieldDTO>

export class ReferenceField extends AbstractField<ReferenceFieldValue, undefined, IReferenceFieldOption> {
  public readonly option: Option<IReferenceFieldOption>

  constructor(dto: IReferenceFieldDTO) {
    super(dto)

    this.option = Some({
      isOwner: dto.option.isOwner,
      foreignTableId: dto.option.foreignTableId,
      symmetricFieldId: dto.option.symmetricFieldId,
    })

    this.display = false
  }

  static create(dto: ICreateReferenceFieldDTO) {
    return new ReferenceField({
      type: "reference",
      name: dto.name,
      option: { foreignTableId: dto.option.foreignTableId, isOwner: true },
      id: FieldIdVo.fromStringOrCreate(dto.id).value,
    })
  }

  static createSymmetricField(foreignTable: TableDo, table: TableDo, field: ReferenceField) {
    return new ReferenceField({
      type: "reference",
      name: table.schema.getNextFieldName(field.name.value),
      option: { isOwner: false, foreignTableId: foreignTable.id.value, symmetricFieldId: field.id.value },
      id: FieldIdVo.create().value,
    })
  }

  connect(field: ReferenceField) {
    this.option.expect("no reference field option").symmetricFieldId = field.id.value
  }

  override type = REFERENCE_TYPE

  override get valueSchema() {
    return recordId.array().optional().nullable()
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

  public get foreignTableId(): string {
    return this.option.unwrap().foreignTableId
  }
}
