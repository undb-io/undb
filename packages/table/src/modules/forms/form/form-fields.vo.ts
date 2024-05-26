import { ValueObject } from "@undb/domain"
import type { FormFieldVO } from "./form-field.vo"

export class FormFieldsVO extends ValueObject<FormFieldVO[]> {
  toJSON() {
    return this.value.map((field) => field.toJSON())
  }
}
