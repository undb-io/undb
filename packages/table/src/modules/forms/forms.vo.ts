import { ValueObject } from "@undb/domain"
import { formDTO, type FormVO } from "./form/form.vo"

export const formsDTO = formDTO.array()

export class FormsVO extends ValueObject<FormVO[]> {
  toJSON() {
    return this.value.map((form) => form.toJSON())
  }
}
