import { ValueObject } from "@undb/domain"
import type { IFormsDTO } from "./dto"
import { FormVO, type IFormDTO } from "./form/form.vo"
import { TableFormsSpecification, WithFormSpecification } from "../../specifications/table-forms.specification"
import type { Field } from ".."

export class FormsVO extends ValueObject<FormVO[]> {
  static fromJSON(forms: IFormsDTO) {
    return new FormsVO(forms.map((form) => FormVO.fromJSON(form)))
  }

  *[Symbol.iterator]() {
    yield* this.props
  }

  $setForm(dto: IFormDTO): WithFormSpecification {
    const previous = this.props.find((form) => form.id === dto.id)?.toJSON()
    return new WithFormSpecification(previous, FormVO.fromJSON(dto))
  }

  $addField(field: Field): TableFormsSpecification {
    const forms = new FormsVO(this.props.map((form) => form.addField(field)))
    return new TableFormsSpecification(forms)
  }

  toJSON() {
    return this.props.map((form) => form.toJSON())
  }
}
