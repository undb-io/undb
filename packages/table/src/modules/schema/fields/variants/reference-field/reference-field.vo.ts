import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { Field, RecordComositeSpecification, RollupField } from "../../../.."
import { tableId } from "../../../../../table-id.vo"
import type { TableDo } from "../../../../../table.do"
import { recordId } from "../../../../records/record/record-id.vo"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractNumberFieldMather } from "../abstractions"
import type { INumberFieldCondition } from "../number-field"
import { ReferenceEqual } from "./reference-field-value.specification"
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
    const symmetricField = new ReferenceField({
      type: "reference",
      name: table.schema.getNextFieldName(foreignTable.name.value),
      option: { isOwner: false, foreignTableId: foreignTable.id.value, symmetricFieldId: field.id.value },
      id: FieldIdVo.create().value,
    })

    symmetricField.connect(field)

    return symmetricField
  }

  connect(symmetricField: ReferenceField) {
    this.option.expect("no reference field option").symmetricFieldId = symmetricField.id.value
    symmetricField.option.expect("no reference field option").symmetricFieldId = this.id.value
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

  override getMutationSpec(value: ReferenceFieldValue): Option<RecordComositeSpecification> {
    return Some(new ReferenceEqual(value, this.id))
  }

  public get isOwner() {
    return this.option.unwrap().isOwner
  }

  public get foreignTableId(): string {
    return this.option.unwrap().foreignTableId
  }

  public get symmetricFieldId() {
    return this.option.unwrap().symmetricFieldId
  }

  public override duplicate(name: string) {
    return new ReferenceField({
      type: "reference",
      name,
      option: {
        isOwner: true,
        foreignTableId: this.foreignTableId,
        symmetricFieldId: undefined,
      },
      id: FieldIdVo.create().value,
    })
  }

  getRollupFields(fields: Field[]): RollupField[] {
    return fields.filter((f) => f.type === "rollup" && f.referenceFieldId === this.id.value) as RollupField[]
  }
}
