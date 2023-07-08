import type { z } from 'zod'
import type { FormFields } from './form-fields.vo.js'
import type { FormId } from './form-id.vo.js'
import type { FormName } from './form-name.vo.js'
import type { queryForm } from './form.schema.js'

export interface IForm {
  id: FormId
  name: FormName
  fields: FormFields
}

export type IQueryForm = z.infer<typeof queryForm>
