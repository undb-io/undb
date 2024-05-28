import { ValueObject, Option } from "@undb/domain"
import { FormFieldsVO } from "./form-fields.vo"
import { FormFieldVO, formField } from "./form-field.vo"
import { z } from "@undb/zod"
import { FormNameVo, formName } from "./form-name.vo"
import { FormIdVO, formId, type FormId } from "./form-id.vo"
import type { TableDo } from "../../../table.do"
import type { ICreateFormDTO } from "../dto"
import type { Field } from "../.."

export const formDTO = z.object({
  id: formId,
  name: formName,
  description: z.string().optional(),
  fields: formField.array(),
})

export type IFormDTO = z.infer<typeof formDTO>

interface IForm {
  id: FormId
  description?: string
  name: FormNameVo
  fields: FormFieldsVO
}

export class FormVO extends ValueObject<IForm> {
  public get id() {
    return this.props.id.value
  }

  public get description() {
    return this.props.description
  }

  public set description(description: string | undefined) {
    this.props.description = description
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

  public addField(field: Field) {
    const formFields = this.props.fields.addField(field)
    return new FormVO({
      id: this.props.id,
      name: this.props.name,
      description: this.description,
      fields: formFields,
    })
  }

  static create(table: TableDo, dto: ICreateFormDTO) {
    return new FormVO({
      id: FormIdVO.create(),
      name: new FormNameVo(dto.name),
      fields: FormFieldsVO.create(table),
    })
  }

  static fromJSON(dto: IFormDTO) {
    return new FormVO({
      id: new FormIdVO(dto.id),
      name: new FormNameVo(dto.name),
      description: dto.description,
      fields: new FormFieldsVO(dto.fields.map((field) => new FormFieldVO(field))),
    })
  }

  toJSON() {
    const props = this.props
    return {
      id: props.id.value,
      name: props.name.value,
      description: props.description,
      fields: props.fields.toJSON(),
    }
  }

  getPreviousFields(fieldId: string): FormFieldVO[] {
    return this.props.fields.getPreviousFields(fieldId)
  }
}
