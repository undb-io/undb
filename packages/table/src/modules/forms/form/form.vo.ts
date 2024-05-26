import { ValueObject } from "@undb/domain"
import { FormFieldsVO } from "./form-fields.vo"
import { FormFieldVO, formField } from "./form-field.vo"
import { z } from "@undb/zod"
import { FormNameVo, formName } from "./form-name.vo"
import { FormIdVO, formId, type FormId } from "./form-id.vo"
import type { TableDo } from "../../../table.do"
import type { ICreateFormDTO } from "../dto"

export const formDTO = z.object({
  id: formId,
  name: formName,
  fields: formField.array(),
})

export type IFormDTO = z.infer<typeof formDTO>

interface IForm {
  id: FormId
  name: FormNameVo
  fields: FormFieldsVO
}

export class FormVO extends ValueObject<IForm> {
  public get name() {
    return this.props.name.value
  }

  public get fields() {
    return this.props.fields
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
      fields: new FormFieldsVO(dto.fields.map((field) => new FormFieldVO(field))),
    })
  }

  toJSON() {
    const props = this.props
    return {
      id: props.id.value,
      name: props.name.value,
      fields: props.fields.toJSON(),
    }
  }
}
