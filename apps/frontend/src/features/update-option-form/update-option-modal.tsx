import type { IMutateOptionSchema, SelectField } from '@undb/core'
import type { ContextModalProps } from '@undb/ui'
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

export default UpdateOptionModal
