import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { IdEqual, IdIn } from "./id-field-value.specification"
import { IdFieldValue } from "./id-field-value.vo"
import { idFieldAggregate } from "./id-field.aggregate"
import { createIdFieldCondition, type IIdFieldCondition, type IIdFieldConditionSchema } from "./id-field.condition"

export const ID_TYPE = "id" as const

export const createIdFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(ID_TYPE),
})

export type ICreateIdFieldDTO = z.infer<typeof createIdFieldDTO>

export const updateIdFieldDTO = createIdFieldDTO.setKey("id", fieldId)
export type IUpdateIdFieldDTO = z.infer<typeof updateIdFieldDTO>

export const idFieldDTO = baseFieldDTO.extend({
  type: z.literal(ID_TYPE),
})

export type IIdFieldDTO = z.infer<typeof idFieldDTO>

export class IdField extends AbstractField<IdFieldValue> {
  constructor(dto: IIdFieldDTO) {
    super(dto)
  }

  protected override system: boolean = true

  static create(dto: ICreateIdFieldDTO) {
    return new IdField({ ...dto, id: new FieldIdVo("id").value })
  }

  override type = ID_TYPE

  override get valueSchema() {
    return z.string()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.id(this)
  }

  override getSpec(condition: IIdFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new IdEqual(new IdFieldValue(value), this.id))
      .with({ op: "neq" }, ({ value }) => new IdEqual(new IdFieldValue(value), this.id).not())
      .with({ op: "in" }, ({ value }) => new IdIn(value, this.id))
      .with({ op: "nin" }, ({ value }) => new IdIn(value, this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema<OptionType extends z.ZodTypeAny>(
    optionType: OptionType,
  ): IIdFieldConditionSchema {
    return createIdFieldCondition(optionType)
  }

  override getMutationSpec(value: IdFieldValue): Option<RecordComositeSpecification> {
    return Some(new IdEqual(value, this.id))
  }

  override get aggregate() {
    return idFieldAggregate
  }
}
