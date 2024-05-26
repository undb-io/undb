import { ValueObject } from "@undb/domain"
import { FormVO, formDTO } from "./form/form.vo"
import type { IFormsDTO } from "./dto"

export const formsDTO = formDTO.array()

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
