import type { z } from 'zod'
import type { FormId } from './form-id.vo.js'
import type { FormName } from './form-name.vo.js'
import type { queryForm } from './form.schema.js'

export interface IForm {
  id: FormId
  name: FormName
}

export type IQueryForm = z.infer<typeof queryForm>
