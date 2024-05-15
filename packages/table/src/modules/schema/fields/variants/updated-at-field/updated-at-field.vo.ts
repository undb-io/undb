import { Option } from "@undb/domain"
import { match } from "ts-pattern"
import { z } from "zod"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { DateIsSameDay } from "../abstractions/abstract-date-value.specification"
import { UpdatedAtFieldValue } from "./updated-at-field-value.vo"
import {
  updatedAtFieldFilter,
  type IUpdatedAtFieldFilter,
  type IUpdatedAtFieldFilterSchema,
} from "./updated-at-field.filter"

export const UPDATED_AT_TYPE = "updatedAt" as const

export const createUpdatedAtFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(UPDATED_AT_TYPE),
})

export type ICreateUpdatedAtFieldDTO = z.infer<typeof createUpdatedAtFieldDTO>

export const updatedAtFieldDTO = baseFieldDTO.extend({
  type: z.literal(UPDATED_AT_TYPE),
})

export type IUpdatedAtFieldDTO = z.infer<typeof updatedAtFieldDTO>

export class UpdatedAtField extends AbstractField<UpdatedAtFieldValue> {
  constructor(dto: IUpdatedAtFieldDTO) {
    super(dto)
  }

  protected override system: boolean = true

  static create(dto: ICreateUpdatedAtFieldDTO) {
    return new UpdatedAtField({ ...dto, id: new FieldIdVo(UPDATED_AT_TYPE).value })
  }

  override type = UPDATED_AT_TYPE

  override get valueSchema() {
    if (this.required) {
      return z.string().min(1)
    }

    return z.string().optional()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.updatedAt(this)
  }

  override getSpec(filter: IUpdatedAtFieldFilter) {
    const spec = match(filter)
      .with({ op: "is_same_day" }, ({ value }) => new DateIsSameDay(new Date(value), this.id))
      .with({ op: "is_not_same_day" }, ({ value }) => new DateIsSameDay(new Date(value), this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override get filterSchema(): IUpdatedAtFieldFilterSchema {
    return updatedAtFieldFilter
  }
}
