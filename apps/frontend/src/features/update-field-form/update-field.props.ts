import type { Field } from '@undb/core'

export type IUpdateFieldProps = {
  field: Field
  onCancel?: () => void
  onSuccess?: () => void
}
