import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { isString } from "radash"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { createAbstractDateConditionMather } from "../abstractions/abstract-date-field.condition"
import { abstractDateAggregate } from "../abstractions/abstract-date.aggregate"
import { DateFieldConstraint } from "./date-field-constraint.vo"
import { dateFieldValue, DateFieldValue } from "./date-field-value.vo"
import {
  createDateFieldCondition,
  type IDateFieldCondition,
  type IDateFieldConditionSchema,
} from "./date-field.condition"
import { DateEqual } from "./date-field.specification"

export const DATE_TYPE = "date" as const

export const createDateFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(DATE_TYPE),
  defaultValue: dateFieldValue,
})

export type ICreateDateFieldDTO = z.infer<typeof createDateFieldDTO>
export const updateDateFieldDTO = createDateFieldDTO.setKey("id", fieldId)
export type IUpdateDateFieldDTO = z.infer<typeof updateDateFieldDTO>

export const dateFieldDTO = baseFieldDTO.extend({
  type: z.literal(DATE_TYPE),
  defaultValue: dateFieldValue,
})

export type IDateFieldDTO = z.infer<typeof dateFieldDTO>

export class DateField extends AbstractField<DateFieldValue> {
  constructor(dto: IDateFieldDTO) {
    super(dto)
    if (dto.defaultValue) {
      this.defaultValue = new DateFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateDateFieldDTO) {
    return new DateField({ ...dto, id: FieldIdVo.create().value })
  }

  override type = DATE_TYPE

  override get valueSchema() {
    return this.constraint.unwrapOrElse(() => new DateFieldConstraint({})).schema
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

  override get aggregate() {
    return abstractDateAggregate
  }

  override getMutationSpec(value: DateFieldValue): Option<RecordComositeSpecification> {
    return Some(new DateEqual(isString(value.value) ? new Date(value.value) : value.value ?? null, this.id))
  }
}
