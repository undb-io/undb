import { ValueObject } from "@undb/domain"
import type { IFormsDTO } from "./dto"
import { FormVO } from "./form/form.vo"

export class FormsVO extends ValueObject<FormVO[]> {
  static fromJSON(forms: IFormsDTO) {
    return new FormsVO(forms.map((form) => FormVO.fromJSON(form)))
  }

  *[Symbol.iterator]() {
    yield* this.props
  }

  toJSON() {
    return this.props.map((form) => form.toJSON())
  }
}
