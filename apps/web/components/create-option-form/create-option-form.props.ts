import type { IOptionColor, SelectField, Table } from '@egodb/core'

export type ICreateOptionFormProps = {
  table: Table
  field: SelectField
  color: IOptionColor
}
