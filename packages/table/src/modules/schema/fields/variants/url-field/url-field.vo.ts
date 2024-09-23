import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { StringContains, StringEmpty, StringEndsWith, StringStartsWith } from "../string-field"
import { UrlFieldConstraint, urlFieldConstraint } from "./url-field-constraint.vo"
import { urlFieldValue, UrlFieldValue } from "./url-field-value.vo"
import { urlFieldAggregate } from "./url-field.aggregate"
import { createUrlFieldCondition, type IUrlFieldCondition, type IUrlFieldConditionSchema } from "./url-field.condition"
import { UrlEqual } from "./url-field.specification"

export const URL_TYPE = "url" as const

export const createUrlFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(URL_TYPE),
  constraint: urlFieldConstraint.optional(),
  defaultValue: urlFieldValue,
})

export const createTablesUrlFieldDTO = createUrlFieldDTO

export type ICreateUrlFieldDTO = z.infer<typeof createUrlFieldDTO>

export const updateUrlFieldDTO = createUrlFieldDTO.setKey("id", fieldId)
export type IUpdateUrlFieldDTO = z.infer<typeof updateUrlFieldDTO>

export const urlFieldDTO = baseFieldDTO.extend({
  type: z.literal(URL_TYPE),
  constraint: urlFieldConstraint.optional(),
  defaultValue: urlFieldValue,
})

export type IUrlFieldDTO = z.infer<typeof urlFieldDTO>

export class UrlField extends AbstractField<UrlFieldValue, UrlFieldConstraint> {
  constructor(dto: IUrlFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new UrlFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new UrlFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateUrlFieldDTO) {
    const field = new UrlField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    if (dto.defaultValue) {
      field.defaultValue = new UrlFieldValue(dto.defaultValue)
    }
    return field
  }

  override type = URL_TYPE

  override get #constraint(): UrlFieldConstraint {
    return this.constraint.unwrapOrElse(() => new UrlFieldConstraint({}))
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
    visitor.url(this)
  }

  override getSpec(condition: IUrlFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new UrlEqual(value, this.id))
      .with({ op: "neq" }, ({ value }) => new UrlEqual(value, this.id).not())
      .with({ op: "contains" }, ({ value }) => new StringContains(value, this.id))
      .with({ op: "does_not_contain" }, ({ value }) => new StringContains(value, this.id).not())
      .with({ op: "starts_with" }, ({ value }) => new StringStartsWith(value, this.id))
      .with({ op: "ends_with" }, ({ value }) => new StringEndsWith(value, this.id))
      .with({ op: "is_empty" }, () => new StringEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new StringEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IUrlFieldConditionSchema {
    return createUrlFieldCondition(optionType)
  }

  override getMutationSpec(value: UrlFieldValue): Option<RecordComositeSpecification> {
    return Some(new UrlEqual(value.value ?? null, this.id))
  }

  override get aggregate() {
    return urlFieldAggregate
  }
}
