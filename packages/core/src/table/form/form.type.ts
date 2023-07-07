import type { z } from 'zod'
import type { FormId } from './form-id.vo.js'
import type { queryForm } from './forms.schema.js'

export interface IForm {
  id: FormId
}

export type IQueryForm = z.infer<typeof queryForm>
