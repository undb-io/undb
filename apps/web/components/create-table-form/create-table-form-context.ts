import type { ICreateTableInput } from '@egodb/core'
import { createFormContext } from '@egodb/ui'

export const [CreateTableFormProvider, useCreateTableFormContext, useCreateTable] =
  createFormContext<ICreateTableInput>()
