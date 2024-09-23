import { ValueObject } from "@undb/domain"
import type { Field } from ".."
import { TableFormsSpecification, WithFormSpecification } from "../../specifications/table-forms.specification"
import type { TableDo } from "../../table.do"
import type { ICreateFormDTO, IFormsDTO } from "./dto"
import { FormVO, type IFormDTO } from "./form/form.vo"

export class FormsVO extends ValueObject<FormVO[]> {
  static fromJSON(forms: IFormsDTO) {
    return new FormsVO(forms.map((form) => FormVO.fromJSON(form)))
  }

  static create(table: TableDo, forms?: ICreateFormDTO[]) {
    if (forms?.length) {
      return new FormsVO(forms.map((form) => FormVO.create(table, form)))
    }
    return new FormsVO([])
  }

  *[Symbol.iterator]() {
    yield* this.props
  }

  get forms() {
    return this.props
  }

  $setForm(dto: IFormDTO): WithFormSpecification {
    const previous = this.props.find((form) => form.id === dto.id)?.toJSON()
    return new WithFormSpecification(previous, FormVO.fromJSON(dto))
  }

  $addField(field: Field): TableFormsSpecification {
    const forms = new FormsVO(this.props.map((form) => form.addField(field)))
    return new TableFormsSpecification(forms)
  }

  $deleteField(field: Field): TableFormsSpecification {
    const forms = new FormsVO(this.props.map((form) => form.deleteField(field)))
    return new TableFormsSpecification(forms)
  }

  getFormById(formId: string) {
    return this.props.find((form) => form.id === formId)
  }

  getFormByName(formName: string) {
    return this.props.find((form) => form.name === formName)
  }

  getFormnByIdOrName(idOrName: string) {
    return this.props.find((form) => form.id === idOrName || form.name === idOrName)
  }

  toJSON() {
    return this.props.map((form) => form.toJSON())
  }
}
