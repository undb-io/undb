import type { IMutateOptionSchema, SelectField } from '@egodb/core'
import type { ContextModalProps } from '@egodb/ui'
import { UpdateOptionForm } from './update-option-form'

export type IUpdateOptionModalProps = {
  tableId: string
  field: SelectField
  optionKey: string
  option: IMutateOptionSchema
}

export const UpdateOptionModal = ({ innerProps }: ContextModalProps<IUpdateOptionModalProps>) => (
  <>
    <UpdateOptionForm {...innerProps} />
  </>
)
