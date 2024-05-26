import { ValueObject } from "@undb/domain"
import type { FormFieldsVO } from "./form-fields.vo"
import { formField } from "./form-field.vo"
import { z } from "@undb/zod"
import { FormNameVo, formName } from "./form-name.vo"
import { formId, type FormId } from "./form-id.vo"

export const formDTO = z.object({
  id: formId,
  name: formName,
  fields: formField.array(),
})

interface IForm {
  id: FormId
  name: FormNameVo
  fields: FormFieldsVO
}

export class FormVO extends ValueObject<IForm> {
  toJSON() {
    return {
      id: this.value.id.value,
      name: this.value.name.value,
      fields: this.value.fields.toJSON(),
    }
  }
}
