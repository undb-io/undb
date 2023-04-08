import type { IOptionColor, SelectField } from '@undb/core'

export type ICreateOptionFormProps = {
  field: SelectField
  color: IOptionColor
  onSuccess?: () => void
}
