import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { Options, option, optionName } from "../../option"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
// import { createAbstractSelectFieldMather } from "../abstractions/abstract-select-field.condition"
// import { abstractSelectAggregate } from "../abstractions/abstract-select.aggregate"
import { SelectFieldConstraint, selectFieldConstraint } from "./select-field-constraint.vo"
import { SelectEqual } from "./select-field-specification"
import { SelectFieldValue, mutateSelectFieldValueSchema } from "./select-field-value.vo"
import {
  createSelectFieldCondition,
  type ISelectFieldCondition,
  type ISelectFieldConditionSchema,
} from "./select-field.condition"

export const SELECT_TYPE = "select" as const

export const createSelectFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(SELECT_TYPE),
  constraint: selectFieldConstraint.optional(),
  defaultValue: optionName.optional(),
  options: option.array().nonempty(),
})

export type ICreateSelectFieldDTO = z.infer<typeof createSelectFieldDTO>

export const updateSelectFieldDTO = createSelectFieldDTO.setKey("id", fieldId)
export type IUpdateSelectFieldDTO = z.infer<typeof updateSelectFieldDTO>

export const selectFieldDTO = baseFieldDTO.extend({
  type: z.literal(SELECT_TYPE),
  constraint: selectFieldConstraint.optional(),
  defaultValue: optionName.optional(),
  options: option.array().nonempty(),
})

export type ISelectFieldDTO = z.infer<typeof selectFieldDTO>

export class SelectField extends AbstractField<SelectFieldValue, SelectFieldConstraint> {
  public options: Options

  constructor(dto: ISelectFieldDTO) {
    super(dto)
    this.options = Options.fromArray(dto.options)
    if (dto.constraint) {
      this.constraint = Some(new SelectFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new SelectFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateSelectFieldDTO) {
    const field = new SelectField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    if (dto.defaultValue) {
      field.defaultValue = new SelectFieldValue(dto.defaultValue)
    }
    return field
  }

  override type = SELECT_TYPE

  override get valueSchema() {
    return this.constraint.unwrapOrElse(() => new SelectFieldConstraint({})).schema
  }

  override get mutateSchema() {
    return Some(mutateSelectFieldValueSchema)
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.select(this)
  }

  override getSpec(condition: ISelectFieldCondition) {
    throw new Error("Method not implemented.")
    // const spec = createAbstractSelectFieldMather(condition, this.id).exhaustive()

    // return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): ISelectFieldConditionSchema {
    return createSelectFieldCondition(optionType)
  }

  override getMutationSpec(value: SelectFieldValue): Option<RecordComositeSpecification> {
    return Some(new SelectEqual(value.value, this.id))
  }

  override get aggregate() {
    return z.enum([])
  }
}
