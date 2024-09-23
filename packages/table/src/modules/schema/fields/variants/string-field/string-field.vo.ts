import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { isString } from "radash"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { StringFieldConstraint, stringFieldConstraint } from "./string-field-constraint.vo"
import {
  StringContains,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringMax,
  StringMin,
  StringStartsWith,
} from "./string-field-value.specification"
import { StringFieldValue, stringFieldValue } from "./string-field-value.vo"
import { stringFieldAggregate } from "./string-field.aggregate"
import {
  createStringFieldCondition,
  type IStringFieldCondition,
  type IStringFieldConditionSchema,
} from "./string-field.condition"

export const STRING_TYPE = "string" as const

export const createStringFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(STRING_TYPE),
  constraint: stringFieldConstraint.optional(),
  defaultValue: stringFieldValue,
})

export const createTablesStringFieldDTO = createStringFieldDTO

export type ICreateStringFieldDTO = z.infer<typeof createStringFieldDTO>

export const updateStringFieldDTO = createStringFieldDTO.setKey("id", fieldId)
export type IUpdateStringFieldDTO = z.infer<typeof updateStringFieldDTO>

export const stringFieldDTO = baseFieldDTO.extend({
  type: z.literal(STRING_TYPE),
  constraint: stringFieldConstraint.optional(),
  defaultValue: stringFieldValue,
})

export type IStringFieldDTO = z.infer<typeof stringFieldDTO>

export class StringField extends AbstractField<StringFieldValue, StringFieldConstraint> {
  constructor(dto: IStringFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new StringFieldConstraint(dto.constraint))
    }
    if (isString(dto.defaultValue)) {
      this.defaultValue = new StringFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateStringFieldDTO) {
    return new StringField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = STRING_TYPE

  override get searchable() {
    return true
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.string(this)
  }

  get #constraint(): StringFieldConstraint {
    return this.constraint.unwrapOrElse(() => new StringFieldConstraint({}))
  }

  override getConstraintFromFormField(formField: FormFieldVO) {
    return this.#constraint.fromFormField(formField)
  }

  override get valueSchema() {
    return this.#constraint.schema
  }

  override get mutateSchema() {
    return this.#constraint.mutateSchema
  }

  override getSpec(condition: IStringFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new StringEqual(new StringFieldValue(value), this.id))
      .with({ op: "neq" }, ({ value }) => new StringEqual(new StringFieldValue(value), this.id).not())
      .with({ op: "contains" }, ({ value }) => new StringContains(value, this.id))
      .with({ op: "does_not_contain" }, ({ value }) => new StringContains(value, this.id).not())
      .with({ op: "starts_with" }, ({ value }) => new StringStartsWith(value, this.id))
      .with({ op: "ends_with" }, ({ value }) => new StringEndsWith(value, this.id))
      .with({ op: "is_empty" }, () => new StringEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new StringEmpty(this.id).not())
      .with({ op: "min" }, ({ value }) => new StringMin(this.id, value))
      .with({ op: "max" }, ({ value }) => new StringMax(this.id, value))
      .exhaustive()

    return Option(spec)
  }

  override getMutationSpec(value: StringFieldValue): Option<RecordComositeSpecification> {
    return Some(new StringEqual(value, this.id))
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IStringFieldConditionSchema {
    return createStringFieldCondition(optionType)
  }

  override get aggregate() {
    return stringFieldAggregate
  }
}
