import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { IRecordComositeSpecification } from "../../../../records"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { ButtonFieldValue } from "./button-field-value.vo"

export const BUTTON_TYPE = "button" as const

export const buttonFieldUpdateAction = z.object({
  type: z.literal("update"),
  field: fieldId.optional(),
  // TODO: value type should be defined
  value: z.any(),
  confirm: z.boolean().optional(),
})

export const buttonFieldOption = z.object({
  label: z.string().optional(),
  action: buttonFieldUpdateAction,
})

export const createButtonFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(BUTTON_TYPE),
  option: buttonFieldOption,
})

export type ICreateButtonFieldDTO = z.infer<typeof createButtonFieldDTO>

export const updateButtonFieldDTO = createButtonFieldDTO.setKey("id", fieldId)
export type IUpdateButtonFieldDTO = z.infer<typeof updateButtonFieldDTO>

export const buttonFieldDTO = baseFieldDTO.extend({
  type: z.literal(BUTTON_TYPE),
  option: buttonFieldOption,
})

export type IButtonFieldOption = z.infer<typeof buttonFieldOption>

export type IButtonFieldDTO = z.infer<typeof buttonFieldDTO>

export class ButtonField extends AbstractField<ButtonFieldValue, undefined, IButtonFieldOption> {
  constructor(dto: IButtonFieldDTO) {
    super(dto)
    if (dto.option) {
      this.option = Some(dto.option)
    }
  }

  static create(dto: ICreateButtonFieldDTO) {
    const field = new ButtonField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    return field
  }

  public get label() {
    return this.option.into(undefined)?.label
  }

  override type = BUTTON_TYPE

  override get aggregate() {
    return z.undefined()
  }

  override get mutateSchema() {
    return None
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
