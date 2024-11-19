import { Option, Some, applyRules } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { TableDo } from "../../../../../table.do"
import { ColorsVO } from "../../../../colors/colors.vo"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { Options, option, optionId, type IOptionId } from "../../option"
import { OptionNameShouldBeUnique } from "../../rules/option-name-should-be-unique.rule"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { SelectFieldConstraint, selectFieldConstraint } from "./select-field-constraint.vo"
import { SelectContainsAnyOf, SelectEmpty, SelectEqual } from "./select-field-specification"
import { SelectFieldValue } from "./select-field-value.vo"
import { selectFieldAggregate } from "./select-field.aggregate"
import {
  createSelectFieldCondition,
  type ISelectFieldCondition,
  type ISelectFieldConditionSchema,
} from "./select-field.condition"

export const SELECT_TYPE = "select" as const

export const selectFieldOption = z.object({
  options: option.array(),
})

export type ISelectFieldOption = z.infer<typeof selectFieldOption>

export const createSelectFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(SELECT_TYPE),
  constraint: selectFieldConstraint.optional(),
  defaultValue: optionId.or(optionId.array()).optional().nullable(),
  option: selectFieldOption,
})

export const createTablesSelectFieldDTO = createSelectFieldDTO

export type ICreateSelectFieldDTO = z.infer<typeof createSelectFieldDTO>

export const updateSelectFieldDTO = createSelectFieldDTO.setKey("id", fieldId)
export type IUpdateSelectFieldDTO = z.infer<typeof updateSelectFieldDTO>

export const selectFieldDTO = baseFieldDTO.extend({
  type: z.literal(SELECT_TYPE),
  constraint: selectFieldConstraint.optional(),
  defaultValue: optionId.or(optionId.array()).optional().nullable(),
  option: selectFieldOption,
})

export type ISelectFieldDTO = z.infer<typeof selectFieldDTO>

export class SelectField extends AbstractField<SelectFieldValue, SelectFieldConstraint, ISelectFieldOption> {
  public readonly option: Option<ISelectFieldOption>

  constructor(dto: ISelectFieldDTO) {
    super(dto)
    this.option = Some({
      options: Options.fromArray(dto.option.options).toJSON(),
    })
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
    const options = field.options.map((o) => o.name)
    applyRules(new OptionNameShouldBeUnique(options))

    return field
  }

  override update(table: TableDo, dto: IUpdateSelectFieldDTO): SelectField {
    const field = super.update(table, dto) as SelectField

    const options = field.options.map((o) => o.name)
    applyRules(new OptionNameShouldBeUnique(options))

    return field
  }

  override type = SELECT_TYPE

  get #constraint() {
    return this.constraint.unwrapOrElse(() => new SelectFieldConstraint({}))
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

  get isSingle() {
    return this.#constraint.isSingle
  }

  get isMultiple() {
    return !this.isSingle
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.select(this)
  }

  override getSpec(condition: ISelectFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new SelectEqual(value, this.id))
      .with({ op: "neq" }, ({ value }) => new SelectEqual(value, this.id).not())
      .with({ op: "any_of" }, ({ value }) => new SelectContainsAnyOf(value, this.id))
      .with({ op: "not_any_of" }, ({ value }) => new SelectContainsAnyOf(value, this.id).not())
      .with({ op: "is_empty" }, ({ value }) => new SelectEmpty(this.id))
      .with({ op: "is_not_empty" }, ({ value }) => new SelectEmpty(this.id).not())
      .exhaustive()

    return Some(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): ISelectFieldConditionSchema {
    return createSelectFieldCondition(optionType)
  }

  override getMutationSpec(value: SelectFieldValue): Option<RecordComositeSpecification> {
    return Some(new SelectEqual(value.value, this.id))
  }

  override get aggregate() {
    return selectFieldAggregate
  }

  get options() {
    return this.option.into(undefined)?.options ?? []
  }

  getOptionById(id: IOptionId) {
    return this.options.find((o) => o.id === id)
  }

  getNextColor() {
    return new ColorsVO().next(this.options[this.options.length - 1]?.color)
  }
}
