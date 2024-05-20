import { Option, Some } from "@undb/domain"
import { match } from "ts-pattern"
import { z } from "zod"
import type { RecordComositeSpecification } from "../../../../records"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import {
  StringContains,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringStartsWith,
} from "./string-field-value.specification"
import { StringFieldValue } from "./string-field-value.vo"
import {
  createStringFieldCondition,
  type IStringFieldCondition,
  type IStringFieldConditionSchema,
} from "./string-field.condition"

export const STRING_TYPE = "string" as const

export const createStringFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(STRING_TYPE),
})

export type ICreateStringFieldDTO = z.infer<typeof createStringFieldDTO>

export const stringFieldDTO = baseFieldDTO.extend({
  type: z.literal(STRING_TYPE),
})

export type IStringFieldDTO = z.infer<typeof stringFieldDTO>

export class StringField extends AbstractField<StringFieldValue> {
  constructor(dto: IStringFieldDTO) {
    super(dto)
  }

  static create(dto: ICreateStringFieldDTO) {
    return new StringField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = STRING_TYPE

  override get valueSchema() {
    if (this.required) {
      return z.string().min(1)
    }

    return z.string().optional()
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
      .exhaustive()

    return Option(spec)
  }

  updateValue(value: StringFieldValue): Option<RecordComositeSpecification> {
    return Some(new StringEqual(value, this.id))
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IStringFieldConditionSchema {
    return createStringFieldCondition(optionType)
  }
}
