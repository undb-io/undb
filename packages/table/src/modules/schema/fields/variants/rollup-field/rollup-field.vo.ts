import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { recordId } from "../../../../records/record/record-id.vo"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractNumberFieldMather } from "../abstractions"
import type { INumberFieldCondition } from "../number-field"
import { RollupFieldValue } from "./rollup-field-value.vo"
import { rollupFieldAggregate } from "./rollup-field.aggregate"
import { createRollupFieldCondition, type IRollupFieldConditionSchema } from "./rollup-field.condition"

export const ROLLUP_TYPE = "rollup" as const

export const rollupFn = z.enum(["sum", "average", "count", "min", "max", "lookup"])

export type IRollupFn = z.infer<typeof rollupFn>

const rollupFieldOption = z.object({
  referenceFieldId: fieldId,
  rollupFieldId: fieldId,
  fn: rollupFn,
})

export type IRollupFieldOption = z.infer<typeof rollupFieldOption>

export const createRollupFieldDTO = createBaseFieldDTO
  .extend({
    type: z.literal(ROLLUP_TYPE),
    option: z.object({
      referenceFieldId: fieldId,
      rollupFieldId: fieldId,
      fn: rollupFn,
    }),
  })
  .omit({ display: true })

export type ICreateRollupFieldDTO = z.infer<typeof createRollupFieldDTO>
export const updateRollupFieldDTO = createRollupFieldDTO.setKey("id", fieldId)
export type IUpdateRollupFieldDTO = z.infer<typeof updateRollupFieldDTO>

export const rollupFieldDTO = baseFieldDTO.extend({
  type: z.literal(ROLLUP_TYPE),
  option: rollupFieldOption,
})

export type IRollupFieldDTO = z.infer<typeof rollupFieldDTO>

export class RollupField extends AbstractField<RollupFieldValue, undefined, IRollupFieldOption> {
  public readonly option: Option<IRollupFieldOption>

  constructor(dto: IRollupFieldDTO) {
    super(dto)

    this.option = Some({
      referenceFieldId: dto.option.referenceFieldId,
      rollupFieldId: dto.option.rollupFieldId,
      fn: dto.option.fn,
    })

    this.display = false
  }

  override computed = true

  static create(dto: ICreateRollupFieldDTO) {
    return new RollupField({
      type: "rollup",
      name: dto.name,
      option: dto.option,
      id: FieldIdVo.fromStringOrCreate(dto.id).value,
    })
  }

  override type = ROLLUP_TYPE

  override get valueSchema() {
    return recordId.array().optional().nullable()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.rollup(this)
  }

  override getSpec(condition: INumberFieldCondition) {
    const spec = createAbstractNumberFieldMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IRollupFieldConditionSchema {
    return createRollupFieldCondition(optionType)
  }

  override get aggregate() {
    return rollupFieldAggregate
  }

  get referenceFieldId() {
    return this.option.mapOr(undefined, (o) => o.referenceFieldId)
  }

  get rollupFieldId() {
    return this.option.mapOr(undefined, (o) => o.rollupFieldId)
  }

  get fn() {
    return this.option.mapOr("lookup", (o) => o.fn)
  }
}
