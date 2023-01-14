import type { IMutateOptionSchema, SelectField } from '@egodb/core'
import type { ContextModalProps } from '@egodb/ui'
import { UpdateOptionForm } from './update-option-form'

export const UDPATE_OPTION_MODAL_ID = 'UPDATE_OPTION'

export type IUpdateOptionModalProps = {
  tableId: string
  field: SelectField
  optionId: string
  option: IMutateOptionSchema
}

export const UpdateOptionModal = ({ innerProps }: ContextModalProps<IUpdateOptionModalProps>) => (
  <>
    <UpdateOptionForm {...innerProps} />
  </>
)
