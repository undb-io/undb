import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { StringContains, StringEmpty } from "../string-field"
import { longTextFieldConstraint, LongTextFieldConstraint } from "./long-text-field-constraint.vo"
import { longTextFieldValue, LongTextFieldValue } from "./long-text-field-value.vo"
import { longTextFieldAggregate } from "./long-text-field.aggregate"
import {
  createLongTextFieldCondition,
  type ILongTextFieldCondition,
  type ILongTextFieldConditionSchema,
} from "./long-text-field.condition"
import { LongTextEqual } from "./long-text-field.specification"

export const LONGTEXT_TYPE = "longText" as const

export const longTextFieldOption = z.object({
  allowRichText: z.boolean().optional().default(true),
})

export type ILongTextFieldOption = z.infer<typeof longTextFieldOption>

export const createLongTextFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(LONGTEXT_TYPE),
  constraint: longTextFieldConstraint.optional(),
  defaultValue: longTextFieldValue,
  option: longTextFieldOption.optional(),
})

export const createTablesLongTextFieldDTO = createLongTextFieldDTO

export type ICreateLongTextFieldDTO = z.infer<typeof createLongTextFieldDTO>

export const updateLongTextFieldDTO = createLongTextFieldDTO.setKey("id", fieldId)
export type IUpdateLongTextFieldDTO = z.infer<typeof updateLongTextFieldDTO>

export const longTextFieldDTO = baseFieldDTO.extend({
  type: z.literal(LONGTEXT_TYPE),
  constraint: longTextFieldConstraint.optional(),
  defaultValue: longTextFieldValue,
  option: longTextFieldOption.optional(),
})

export type ILongTextFieldDTO = z.infer<typeof longTextFieldDTO>

export class LongTextField extends AbstractField<LongTextFieldValue, LongTextFieldConstraint> {
  constructor(dto: ILongTextFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new LongTextFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new LongTextFieldValue(dto.defaultValue)
    }
    if (dto.option) {
      this.option = Some({ allowRichText: dto.option.allowRichText ?? false })
    }
  }

  static create(dto: ICreateLongTextFieldDTO) {
    const field = new LongTextField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    if (dto.defaultValue) {
      field.defaultValue = new LongTextFieldValue(dto.defaultValue)
    }
    if (dto.option) {
      field.option = Some({ allowRichText: dto.option.allowRichText ?? true })
    }
    return field
  }

  override type = LONGTEXT_TYPE

  override get #constraint(): LongTextFieldConstraint {
    return this.constraint.unwrapOrElse(() => new LongTextFieldConstraint({}))
  }

  override get valueSchema() {
    return this.#constraint.schema
  }

  override get mutateSchema() {
    return this.#constraint.mutateSchema
  }

  override getConstraintFromFormField(formField: FormFieldVO) {
    return this.#constraint.fromFormField(formField)
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.longText(this)
  }

  override getSpec(condition: ILongTextFieldCondition) {
    const spec = match(condition)
      .with({ op: "contains" }, ({ value }) => new StringContains(value, this.id))
      .with({ op: "does_not_contain" }, ({ value }) => new StringContains(value, this.id).not())
      .with({ op: "is_empty" }, () => new StringEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new StringEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  public get allowRichText(): boolean {
    return this.option.unwrapOrElse(() => ({ allowRichText: true })).allowRichText
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): ILongTextFieldConditionSchema {
    return createLongTextFieldCondition(optionType)
  }

  override getMutationSpec(value: LongTextFieldValue): Option<RecordComositeSpecification> {
    return Some(new LongTextEqual(value.value ?? null, this.id))
  }

  override get aggregate() {
    return longTextFieldAggregate
  }
}
