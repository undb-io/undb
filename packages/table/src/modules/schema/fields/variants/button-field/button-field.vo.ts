import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { WithUpdatedFieldSpecification } from "../../../../../specifications/table-schema.specification"
import type { TableDo } from "../../../../../table.do"
import type { IRecordComositeSpecification, RecordDO } from "../../../../records"
import { createConditionGroup } from "../../condition/condition.type"
import { conditionWithoutFields, getFieldIdsFromConditionGroup, getSpec } from "../../condition/condition.util"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { Field } from "../../field.type"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { ButtonFieldValue } from "./button-field-value.vo"

export const BUTTON_TYPE = "button" as const

export const buttonFieldUpdateAction = z.object({
  type: z.literal("update"),
  values: z.array(
    z.object({
      field: fieldId.optional(),
      value: z.any(),
    }),
  ),
  confirm: z.boolean().optional(),
})

const buttonCondition = z.any()

export const buttonDisabled = createConditionGroup(buttonCondition, buttonCondition)
export type IButtonDisabled = z.infer<typeof buttonDisabled>

export const buttonFieldOption = z.object({
  label: z.string().optional(),
  action: buttonFieldUpdateAction,
  disabled: buttonDisabled.optional(),
})

export const createButtonFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(BUTTON_TYPE),
  option: buttonFieldOption,
})

export const createTablesButtonFieldDTO = createButtonFieldDTO

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
    return this.option.into(undefined)?.label ?? this.name.value
  }

  public getDisableSpec(table: TableDo): Option<IRecordComositeSpecification> {
    const disabled = this.option.into(undefined)?.disabled
    if (!disabled) return None

    return getSpec(table.schema, disabled) as Option<IRecordComositeSpecification>
  }

  public getIsDisabled(table: TableDo, record: RecordDO) {
    const values = this.option.into(undefined)?.action.values
    if (!values?.length) return true

    const disabled = this.option.into(undefined)?.disabled
    if (!disabled) return false

    const spec = this.getDisableSpec(table)
    return spec.isSome() ? record.match(spec.unwrap()) : false
  }

  public getFieldIdsFromDisabled() {
    const disabled = this.option.into(undefined)?.disabled
    if (!disabled) return []

    return getFieldIdsFromConditionGroup(disabled)
  }

  override type = BUTTON_TYPE

  override get aggregate() {
    return z.undefined()
  }

  override get mutateSchema() {
    return None
  }

  protected computed = true
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

  get shouldConfirm() {
    return this.option.into(undefined)?.action.confirm ?? false
  }

  override $onOtherFieldDeleted(field: Field) {
    const disabled = this.option.into(undefined)?.disabled
    const action = this.option.into(undefined)?.action
    if (!action || !disabled) return None

    let newDisabled = disabled
    if (disabled) {
      newDisabled = conditionWithoutFields(disabled, new Set([field.id.value]))
    }

    const values = action.values.filter((v) => v.field !== field.id.value)

    const updated = ButtonField.create({
      ...(this.toJSON() as IButtonFieldDTO),
      option: { ...this.option, disabled: newDisabled, action: { ...action, values } },
    })

    return Some(new WithUpdatedFieldSpecification(this, updated))
  }
}
