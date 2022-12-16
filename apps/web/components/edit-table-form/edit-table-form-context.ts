import type { IEditTableCommandInput } from '@egodb/core'
import { createFormContext } from '@egodb/ui'

export const [EditTableFormProvider, useEditTableFormContext, useEditTable] =
  createFormContext<IEditTableCommandInput>()
