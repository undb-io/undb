import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { RecordComositeSpecification } from "../../../../records"
import { FieldIdVo } from "../../field-id.vo"
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
import { StringFieldValue } from "./string-field-value.vo"
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
})

export type ICreateStringFieldDTO = z.infer<typeof createStringFieldDTO>

export const stringFieldDTO = baseFieldDTO.extend({
  type: z.literal(STRING_TYPE),
  constraint: stringFieldConstraint.optional(),
})

export type IStringFieldDTO = z.infer<typeof stringFieldDTO>

export class StringField extends AbstractField<StringFieldValue, StringFieldConstraint> {
  constructor(dto: IStringFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new StringFieldConstraint(dto.constraint))
    }
  }

  static create(dto: ICreateStringFieldDTO) {
    return new StringField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = STRING_TYPE

  override get searchable() {
    return true
  }

  override get valueSchema() {
    return this.constraint.unwrapOrElse(() => new StringFieldConstraint({})).schema
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.string(this)
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

  $updateValue(value: StringFieldValue): Option<RecordComositeSpecification> {
    return Some(new StringEqual(value, this.id))
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IStringFieldConditionSchema {
    return createStringFieldCondition(optionType)
  }

  override get aggregate() {
    return stringFieldAggregate
  }
}
