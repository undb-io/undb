import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { StringContains, StringEmpty, StringEndsWith, StringStartsWith } from "../string-field"
import { EmailFieldConstraint, emailFieldConstraint } from "./email-field-constraint.vo"
import { emailFieldValue, EmailFieldValue } from "./email-field-value.vo"
import { emailFieldAggregate } from "./email-field.aggregate"
import {
  createEmailFieldCondition,
  type IEmailFieldCondition,
  type IEmailFieldConditionSchema,
} from "./email-field.condition"
import { EmailEqual } from "./email-field.specification"

export const EMAIL_TYPE = "email" as const

export const createEmailFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(EMAIL_TYPE),
  constraint: emailFieldConstraint.optional(),
  defaultValue: emailFieldValue,
})

export const createTablesEmailFieldDTO = createEmailFieldDTO

export type ICreateEmailFieldDTO = z.infer<typeof createEmailFieldDTO>

export const updateEmailFieldDTO = createEmailFieldDTO.setKey("id", fieldId)
export type IUpdateEmailFieldDTO = z.infer<typeof updateEmailFieldDTO>

export const emailFieldDTO = baseFieldDTO.extend({
  type: z.literal(EMAIL_TYPE),
  constraint: emailFieldConstraint.optional(),
  defaultValue: emailFieldValue,
})

export type IEmailFieldDTO = z.infer<typeof emailFieldDTO>

export class EmailField extends AbstractField<EmailFieldValue, EmailFieldConstraint> {
  constructor(dto: IEmailFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new EmailFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new EmailFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateEmailFieldDTO) {
    const field = new EmailField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    if (dto.defaultValue) {
      field.defaultValue = new EmailFieldValue(dto.defaultValue)
    }
    return field
  }

  override type = EMAIL_TYPE

  override get #constraint(): EmailFieldConstraint {
    return this.constraint.unwrapOrElse(() => new EmailFieldConstraint({}))
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
    visitor.email(this)
  }

  override getSpec(condition: IEmailFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new EmailEqual(value, this.id))
      .with({ op: "neq" }, ({ value }) => new EmailEqual(value, this.id).not())
      .with({ op: "contains" }, ({ value }) => new StringContains(value, this.id))
      .with({ op: "does_not_contain" }, ({ value }) => new StringContains(value, this.id).not())
      .with({ op: "starts_with" }, ({ value }) => new StringStartsWith(value, this.id))
      .with({ op: "ends_with" }, ({ value }) => new StringEndsWith(value, this.id))
      .with({ op: "is_empty" }, () => new StringEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new StringEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IEmailFieldConditionSchema {
    return createEmailFieldCondition(optionType)
  }

  override getMutationSpec(value: EmailFieldValue): Option<RecordComositeSpecification> {
    return Some(new EmailEqual(value.value ?? null, this.id))
  }

  override get aggregate() {
    return emailFieldAggregate
  }
}
