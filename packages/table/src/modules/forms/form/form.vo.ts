import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { objectify } from "radash"
import type { TableDo } from "../../../table.do"
import type { RecordDO, RecordValues } from "../../records"
import type { Schema } from "../../schema"
import { conditionContainsFields, getSpec } from "../../schema/fields/condition/condition.util"
import type { Field } from "../../schema/fields/field.type"
import type { ICreateFormDTO } from "../dto/create-form.dto"
import type { IDuplicateFormDTO } from "../dto/duplicate-form.dto"
import { FormFieldVO, formField } from "./form-field.vo"
import { FormFieldsVO } from "./form-fields.vo"
import { FormIdVO, formId, type FormId } from "./form-id.vo"
import { FormNameVo, formName } from "./form-name.vo"
import { FormOptionVO, formOption } from "./form-option.vo"

export const formDTO = z.object({
  id: formId,
  name: formName,
  description: z.string().optional().nullable(),
  fields: formField.array(),
  option: formOption.optional(),
})

export type IFormDTO = z.infer<typeof formDTO>

interface IForm {
  id: FormId
  description?: string | null
  name: FormNameVo
  fields: FormFieldsVO
  option?: FormOptionVO | null
}

export class FormVO extends ValueObject<IForm> {
  public get id() {
    return this.props.id.value
  }

  public get description() {
    return this.props.description
  }

  public set description(description: string | undefined | null) {
    this.props.description = description
  }

  public get option() {
    return this.props.option
  }

  public set option(option: FormOptionVO | undefined | null) {
    this.props.option = option
  }

  public get name() {
    return this.props.name.value
  }

  public set name(name: string) {
    this.props.name = new FormNameVo(name)
  }

  public get fields() {
    return this.props.fields
  }

  public set fields(fields: FormFieldsVO) {
    this.props.fields = fields
  }

  public getHiddenFields() {
    return this.fields.props.filter((field) => field.hidden)
  }

  public getHiddenFieldsCount() {
    return this.getHiddenFields().length
  }

  public getFieldsCount() {
    return this.fields.props.length
  }

  public getVisibleFields() {
    return this.fields.props.filter((field) => !field.hidden)
  }

  public getVisibleFieldsCount() {
    return this.getVisibleFields().length
  }

  public get visibleFields() {
    return this.fields.props.filter((field) => !field.hidden)
  }

  public addField(field: Field): FormVO {
    const formFields = this.props.fields.addField(field, !this.option?.autoAddNewField)
    const form = new FormVO({
      id: this.props.id,
      name: this.props.name,
      description: this.description,
      fields: formFields,
      option: this.props.option,
    })

    return form
  }

  public deleteField(field: Field) {
    const formFields = this.props.fields.deleteField(field)
    return new FormVO({
      id: this.props.id,
      name: this.props.name,
      description: this.description,
      fields: formFields,
      option: this.props.option,
    })
  }

  public duplicate(dto: IDuplicateFormDTO): FormVO {
    return new FormVO({
      id: FormIdVO.create(),
      name: dto.name ? new FormNameVo(dto.name) : this.props.name,
      description: this.description,
      fields: this.props.fields,
      option: this.props.option,
    })
  }

  static create(table: TableDo, dto: ICreateFormDTO) {
    return new FormVO({
      id: FormIdVO.create(),
      name: new FormNameVo(dto.name),
      fields: FormFieldsVO.create(table, dto.fields),
    })
  }

  static fromJSON(dto: IFormDTO) {
    return new FormVO({
      id: new FormIdVO(dto.id),
      name: new FormNameVo(dto.name),
      description: dto.description,
      fields: new FormFieldsVO(dto.fields.map((field) => new FormFieldVO(field))),
      option: dto.option ? new FormOptionVO(dto.option) : null,
    })
  }

  toJSON(): IFormDTO {
    const props = this.props
    return {
      id: props.id.value,
      name: props.name.value,
      description: props.description,
      fields: props.fields.toJSON(),
      option: props.option?.toJSON(),
    }
  }

  getAllSelected(): boolean {
    return this.fields.props.every((field) => !field.hidden)
  }

  getPreviousFields(fieldId: string): FormFieldVO[] {
    return this.props.fields.getPreviousFields(fieldId)
  }

  getNextFields(fieldId: string): FormFieldVO[] {
    return this.props.fields.getNextFields(fieldId)
  }

  getIsFormFieldContionInValid(fieldId: string): boolean {
    const target = this.fields.props.find((f) => f.fieldId === fieldId)
    if (!target) return false

    const condition = target.condition
    if (!condition) return false

    const previousFields = this.getPreviousFields(fieldId).filter((field) => field.hidden)
    const nextFields = this.getNextFields(fieldId)

    const ids = new Set([...previousFields, ...nextFields].map((field) => field.fieldId))

    return conditionContainsFields(condition, ids)
  }

  getShouldShowField(fieldId: string, schema: Schema, record: RecordDO): boolean {
    const target = this.fields.props.find((f) => f.fieldId === fieldId)
    if (!target) return true

    const condition = target.condition
    if (!condition) return true

    const isInValidCondition = this.getIsFormFieldContionInValid(fieldId)
    if (isInValidCondition) return true

    const spec = getSpec(schema, condition)
    if (spec.isNone()) return true

    const isSatisfied = spec.unwrap().isSatisfiedBy(record)

    return isSatisfied
  }

  getDefaultValues(): RecordValues {
    return objectify(
      this.fields.props,
      (f) => f.fieldId,
      (f) => f.defaultValue,
    )
  }
}
