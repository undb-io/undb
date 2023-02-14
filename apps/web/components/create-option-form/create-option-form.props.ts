import type { IOptionColor, SelectField } from '@egodb/core'

export type ICreateOptionFormProps = {
  field: SelectField
  color: IOptionColor
  onSuccess?: () => void
}
