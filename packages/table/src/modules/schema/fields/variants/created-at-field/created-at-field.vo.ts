import { Option } from "@undb/domain"
import { match } from "ts-pattern"
import { z } from "zod"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { DateIsSameDay } from "../abstractions/abstract-date-value.specification"
import { CreatedAtFieldValue } from "./created-at-field-value.vo"
import {
  createdAtFieldFilter,
  type ICreatedAtFieldFilter,
  type ICreatedAtFieldFilterSchema,
} from "./created-at-field.filter"

export const CREATED_AT_TYPE = "createdAt" as const

export const createCreatedAtFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(CREATED_AT_TYPE),
})

export type ICreateCreatedAtFieldDTO = z.infer<typeof createCreatedAtFieldDTO>

export const createdAtFieldDTO = baseFieldDTO.extend({
  type: z.literal(CREATED_AT_TYPE),
})

export type ICreatedAtFieldDTO = z.infer<typeof createdAtFieldDTO>

export class CreatedAtField extends AbstractField<CreatedAtFieldValue> {
  constructor(dto: ICreatedAtFieldDTO) {
    super(dto)
  }

  protected override system: boolean = true

  static create(dto: ICreateCreatedAtFieldDTO) {
    return new CreatedAtField({ ...dto, id: new FieldIdVo(CREATED_AT_TYPE).value })
  }

  override type = CREATED_AT_TYPE

  override get valueSchema() {
    if (this.required) {
      return z.string().min(1)
    }

    return z.string().optional()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.createdAt(this)
  }

  override getSpec(filter: ICreatedAtFieldFilter) {
    const spec = match(filter)
      .with({ op: "is_same_day" }, ({ value }) => new DateIsSameDay(value, this.id))
      .with({ op: "is_not_same_day" }, ({ value }) => new DateIsSameDay(value, this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override get filterSchema(): ICreatedAtFieldFilterSchema {
    return createdAtFieldFilter
  }
}
