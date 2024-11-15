import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { StringEmpty } from "../string-field"
import { CurrencyFieldConstraint, currencyFieldConstraint } from "./currency-field-constraint.vo"
import { currencyFieldValue, CurrencyFieldValue } from "./currency-field-value.vo"
import { currencyFieldAggregate } from "./currency-field.aggregate"
import {
  createCurrencyFieldCondition,
  type ICurrencyFieldCondition,
  type ICurrencyFieldConditionSchema,
} from "./currency-field.condition"
import { CurrencyEqual, CurrencyGT, CurrencyGTE, CurrencyLT, CurrencyLTE } from "./currency-field.specification"

export const CURRENCY_TYPE = "currency" as const

export const symbol = z.enum(["$", "￥", "€", "￡"])
export type ISymbol = z.infer<typeof symbol>

export const currencyFieldOption = z.object({
  symbol: symbol,
})

export type ICurrencyFieldOption = z.infer<typeof currencyFieldOption>

export const createCurrencyFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(CURRENCY_TYPE),
  constraint: currencyFieldConstraint.optional(),
  defaultValue: currencyFieldValue.optional(),
  option: currencyFieldOption,
})

export const createTablesCurrencyFieldDTO = createCurrencyFieldDTO

export type ICreateCurrencyFieldDTO = z.infer<typeof createCurrencyFieldDTO>

export const updateCurrencyFieldDTO = createCurrencyFieldDTO.setKey("id", fieldId)
export type IUpdateCurrencyFieldDTO = z.infer<typeof updateCurrencyFieldDTO>

export const currencyFieldDTO = baseFieldDTO.extend({
  type: z.literal(CURRENCY_TYPE),
  constraint: currencyFieldConstraint.optional(),
  defaultValue: currencyFieldValue.optional(),
  option: currencyFieldOption,
})

export type ICurrencyFieldDTO = z.infer<typeof currencyFieldDTO>

export class CurrencyField extends AbstractField<CurrencyFieldValue, CurrencyFieldConstraint, ICurrencyFieldOption> {
  constructor(dto: ICurrencyFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new CurrencyFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new CurrencyFieldValue(dto.defaultValue)
    }
    if (dto.option) {
      this.option = Some(dto.option)
    }
  }

  static create(dto: ICreateCurrencyFieldDTO) {
    const field = new CurrencyField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    if (dto.defaultValue) {
      field.defaultValue = new CurrencyFieldValue(dto.defaultValue)
    }
    return field
  }

  override type = CURRENCY_TYPE

  override get #constraint(): CurrencyFieldConstraint {
    return this.constraint.unwrapOrElse(() => new CurrencyFieldConstraint({}))
  }

  get symbol() {
    return this.option.unwrapOrElse(() => ({ symbol: "$" })).symbol
  }

  get max() {
    return this.#constraint.props.max
  }

  get min() {
    return this.#constraint.props.min
  }

  format(value: number) {
    return `${this.symbol} ${value}`
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
    visitor.currency(this)
  }

  override getSpec(condition: ICurrencyFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new CurrencyEqual(value, this.id))
      .with({ op: "neq" }, ({ value }) => new CurrencyEqual(value, this.id).not())
      .with({ op: "gt" }, ({ value }) => new CurrencyGT(value, this.id))
      .with({ op: "gte" }, ({ value }) => new CurrencyGTE(value, this.id))
      .with({ op: "lt" }, ({ value }) => new CurrencyLT(value, this.id))
      .with({ op: "lte" }, ({ value }) => new CurrencyLTE(value, this.id))
      .with({ op: "is_empty" }, () => new StringEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new StringEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): ICurrencyFieldConditionSchema {
    return createCurrencyFieldCondition(optionType)
  }

  override getMutationSpec(value: CurrencyFieldValue): Option<RecordComositeSpecification> {
    return Some(new CurrencyEqual(value.value ?? null, this.id))
  }

  override get aggregate() {
    return currencyFieldAggregate
  }
}
