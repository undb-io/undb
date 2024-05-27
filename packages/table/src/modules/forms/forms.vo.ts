import { ValueObject } from "@undb/domain"
import type { IFormsDTO } from "./dto"
import { FormVO, type IFormDTO } from "./form/form.vo"
import { WithFormSpecification } from "../../specifications/table-forms.specification"

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

  toJSON() {
    return this.props.map((form) => form.toJSON())
  }
}
