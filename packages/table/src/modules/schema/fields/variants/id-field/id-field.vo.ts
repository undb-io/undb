import { Option } from "@undb/domain"
import { match } from "ts-pattern"
import { z } from "zod"
import { FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { IdEqual } from "./id-field-value.specification"
import { IdFieldValue } from "./id-field-value.vo"
import { createIdFieldFilter, type IIdFieldFilter, type IIdFieldFilterSchema } from "./id-field.filter"

export const ID_TYPE = "id" as const

export const createIdFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(ID_TYPE),
})

export type ICreateIdFieldDTO = z.infer<typeof createIdFieldDTO>

export const idFieldDTO = baseFieldDTO.extend({
  type: z.literal(ID_TYPE),
})

export type IIdFieldDTO = z.infer<typeof idFieldDTO>

export class IdField extends AbstractField<IdFieldValue> {
  constructor(dto: IIdFieldDTO) {
    super(dto)
  }

  protected override system: boolean = true

  static create(dto: ICreateIdFieldDTO) {
    return new IdField({ ...dto, id: new FieldIdVo("id").value })
  }

  override type = ID_TYPE

  override get valueSchema() {
    if (this.required) {
      return z.string().min(1)
    }

    return z.string().optional()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.id(this)
  }

  override getSpec(filter: IIdFieldFilter) {
    const spec = match(filter)
      .with({ op: "eq" }, ({ value }) => new IdEqual(new IdFieldValue(value), this.id))
      .with({ op: "neq" }, ({ value }) => new IdEqual(new IdFieldValue(value), this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override get filterSchema(): IIdFieldFilterSchema {
    return createIdFieldFilter(z.undefined())
  }
}
