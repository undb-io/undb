import { None, Option } from "@undb/domain"
import { z } from "@undb/zod"
import type { IRecordComositeSpecification } from "../../../../records"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { ButtonFieldValue } from "./button-field-value.vo"

export const BUTTON_TYPE = "button" as const

export const createButtonFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(BUTTON_TYPE),
})

export type ICreateButtonFieldDTO = z.infer<typeof createButtonFieldDTO>

export const updateButtonFieldDTO = createButtonFieldDTO.setKey("id", fieldId)
export type IUpdateButtonFieldDTO = z.infer<typeof updateButtonFieldDTO>

export const buttonFieldDTO = baseFieldDTO.extend({
  type: z.literal(BUTTON_TYPE),
})

export type IButtonFieldDTO = z.infer<typeof buttonFieldDTO>

export class ButtonField extends AbstractField<ButtonFieldValue, undefined> {
  constructor(dto: IButtonFieldDTO) {
    super(dto)
  }

  static create(dto: ICreateButtonFieldDTO) {
    const field = new ButtonField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    return field
  }

  override type = BUTTON_TYPE

  override get aggregate() {
    return z.undefined()
  }

  override getConditionSchema() {
    // @ts-ignore
    return z.union([])
  }

  override getSpec() {
    return None as Option<IRecordComositeSpecification>
  }

  override get valueSchema() {
    return z.null()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.button(this)
  }
}
