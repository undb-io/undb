import type { ContextModalProps } from '@undb/ui'
import { UpdateFieldForm } from './update-field-form'
import type { IUpdateFieldProps } from './update-field.props'

export const UpdateFieldModal = ({ innerProps }: ContextModalProps<IUpdateFieldProps>) => {
  return <UpdateFieldForm {...innerProps} />
}
