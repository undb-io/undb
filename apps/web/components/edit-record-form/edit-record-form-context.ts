import type { IUpdateRecordValueSchema } from '@egodb/core'
import { createFormContext } from '@egodb/ui'

export const [UpdateRecordFormProvider, useUpdateRecordFormContext, useUpdateRecord] =
  createFormContext<IUpdateRecordValueSchema>()
