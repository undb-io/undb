import type { Field } from '@egodb/core'

export type IUpdateFieldProps = {
  field: Field
  onCancel?: () => void
  onSuccess?: () => void
}
