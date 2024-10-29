import { Option,Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId,FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField,baseFieldDTO,createBaseFieldDTO } from "../abstract-field.vo"
import { jsonFieldConstraint,JsonFieldConstraint } from "./json-field-constraint.vo"
import { JsonFieldValue } from "./json-field-value.vo"
import { jsonFieldAggregate } from "./json-field.aggregate"
import {
  createJsonFieldCondition,
  type IJsonFieldCondition,
  type IJsonFieldConditionSchema,
} from "./json-field.condition"
import { JsonContains,JsonEmpty,JsonEqual } from "./json-field.specification"

export const JSON_TYPE = "json" as const

export const createJsonFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(JSON_TYPE),
  constraint: jsonFieldConstraint.optional(),
  defaultValue: z.any().optional().nullable(),
})

export const createTablesJsonFieldDTO = createJsonFieldDTO

export type ICreateJsonFieldDTO = z.infer<typeof createJsonFieldDTO>
export const updateJsonFieldDTO = createJsonFieldDTO.setKey("id", fieldId)
export type IUpjsonJsonFieldDTO = z.infer<typeof updateJsonFieldDTO>

export const jsonFieldDTO = baseFieldDTO.extend({
  type: z.literal(JSON_TYPE),
  constraint: jsonFieldConstraint.optional(),
  defaultValue: z.any().optional().nullable(),
})

export type IJsonFieldDTO = z.infer<typeof jsonFieldDTO>

export class JsonField extends AbstractField<JsonFieldValue> {
  constructor(dto: IJsonFieldDTO) {
    super(dto)
    if (dto.defaultValue) {
      this.defaultValue = new JsonFieldValue(dto.defaultValue)
    }
    if (dto.constraint) {
      this.constraint = Some(new JsonFieldConstraint(dto.constraint))
    }
  }

  static create(dto: ICreateJsonFieldDTO) {
    return new JsonField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = JSON_TYPE

  get #constraint(): JsonFieldConstraint {
    return this.constraint.unwrapOrElse(() => new JsonFieldConstraint({}))
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
    visitor.json(this)
  }

  override getSpec(condition: IJsonFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new JsonEqual(value, this.id))
      .with({ op: "neq" }, ({ value }) => new JsonEqual(value, this.id).not())
      .with({ op: "contains" }, ({ value }) => new JsonContains(value, this.id))
      .with({ op: "does_not_contain" }, ({ value }) => new JsonContains(value, this.id).not())
      .with({ op: "is_empty" }, () => new JsonEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new JsonEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IJsonFieldConditionSchema {
    return createJsonFieldCondition(optionType)
  }

  override get aggregate() {
    return jsonFieldAggregate
  }

  override getMutationSpec(value: JsonFieldValue): Option<RecordComositeSpecification> {
    return value.value ? Some(new JsonEqual(value.value, this.id)) : Some(new JsonEqual(null, this.id))
  }
}
