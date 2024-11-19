import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { format } from "date-fns/fp"
import { isString } from "radash"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractDateConditionMather } from "../abstractions/abstract-date-field.condition"
import { abstractDateOption } from "../abstractions/abstract-date-option"
import { abstractDateAggregate } from "../abstractions/abstract-date.aggregate"
import { dateFieldConstraint, DateFieldConstraint } from "./date-field-constraint.vo"
import { isDateFieldMacro } from "./date-field-macro"
import { dateFieldValue, DateFieldValue } from "./date-field-value.vo"

import {
  createDateFieldCondition,
  type IDateFieldCondition,
  type IDateFieldConditionSchema,
} from "./date-field.condition"
import { DateEqual } from "./date-field.specification"

export const DATE_TYPE = "date" as const

export const dateFieldOption = abstractDateOption.extend({
  includeTime: z.boolean().optional(),
})

export type IDateFieldOption = z.infer<typeof dateFieldOption>

export const DEFAULT_DATE_FIELD_OPTION = {
  format: "yyyy-MM-dd",
  includeTime: false,
  timeFormat: "HH:mm",
} as const satisfies IDateFieldOption

export const createDateFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(DATE_TYPE),
  constraint: dateFieldConstraint.optional(),
  defaultValue: dateFieldValue,
  option: dateFieldOption.optional(),
})

export const createTablesDateFieldDTO = createDateFieldDTO

export type ICreateDateFieldDTO = z.infer<typeof createDateFieldDTO>
export const updateDateFieldDTO = createDateFieldDTO.setKey("id", fieldId)
export type IUpdateDateFieldDTO = z.infer<typeof updateDateFieldDTO>

export const dateFieldDTO = baseFieldDTO.extend({
  type: z.literal(DATE_TYPE),
  constraint: dateFieldConstraint.optional(),
  defaultValue: dateFieldValue,
  option: dateFieldOption.optional(),
})

export type IDateFieldDTO = z.infer<typeof dateFieldDTO>

export class DateField extends AbstractField<DateFieldValue, DateFieldConstraint, IDateFieldOption> {
  constructor(dto: IDateFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new DateFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new DateFieldValue(dto.defaultValue)
    }
    if (dto.option) {
      this.option = Some(dto.option)
    }
  }

  get dateFieldOption() {
    return this.option.unwrapOr(DEFAULT_DATE_FIELD_OPTION)
  }

  get dateFormatterString() {
    return this.dateFieldOption.format ?? DEFAULT_DATE_FIELD_OPTION.format
  }

  get timeFormatterString() {
    return this.dateFieldOption.timeFormat ?? DEFAULT_DATE_FIELD_OPTION.timeFormat
  }

  get includeTime() {
    return this.dateFieldOption.includeTime ?? DEFAULT_DATE_FIELD_OPTION.includeTime
  }

  get fullFormatterString() {
    if (this.includeTime) {
      return `${this.dateFormatterString} ${this.timeFormatterString}`
    }
    return this.dateFormatterString
  }

  static create(dto: ICreateDateFieldDTO) {
    return new DateField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  get formatter() {
    const str = this.fullFormatterString
    return format(str)
  }

  format(date: Date) {
    return this.formatter(date)
  }

  override type = DATE_TYPE

  override get #constraint(): DateFieldConstraint {
    return this.constraint.unwrapOrElse(() => new DateFieldConstraint({}))
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
    visitor.date(this)
  }

  override getSpec(condition: IDateFieldCondition) {
    const spec = createAbstractDateConditionMather(condition, this.id).exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IDateFieldConditionSchema {
    return createDateFieldCondition(optionType)
  }

  override formatAggregate(aggregate?: string, value?: number | string): string | number {
    if (value === undefined) return ""
    if (aggregate === "min" || aggregate === "max") return this.formatter(value)
    return value ?? ""
  }

  override get aggregate() {
    return abstractDateAggregate
  }

  override getMutationSpec(value: DateFieldValue): Option<RecordComositeSpecification> {
    return Some(
      new DateEqual(
        isString(value.value)
          ? isDateFieldMacro(value.value)
            ? value.value
            : new Date(value.value)
          : (value.value ?? null),
        this.id,
      ),
    )
  }
}
