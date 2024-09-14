import { z } from "@undb/zod"
import { formName } from "../../../forms"
import { formId } from "../../../forms/form/form-id.vo"
import { recordId } from "../record-id.vo"
import { recordValues } from "../record-values.vo"

export const submitFormDTO = z.object({
  id: recordId.optional(),
  form: formId.or(formName),
  values: recordValues,
})

export type ISubmitFormDTO = z.infer<typeof submitFormDTO>
