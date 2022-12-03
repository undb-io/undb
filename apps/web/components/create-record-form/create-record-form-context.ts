import type { ICreateRecordInput } from '@egodb/core'
import { createFormContext } from '@egodb/ui'

export const [CreateRecordFormProvider, useCreateRecordFormContext, useCreateRecord] =
  createFormContext<ICreateRecordInput>()
