import type { ICreateFieldSchema } from '@egodb/core'
import { createFormContext } from '@egodb/ui'

export const [CreateFieldFormProvider, useCreateFieldFormContext, useCreateField] =
  createFormContext<ICreateFieldSchema>()
