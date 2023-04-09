import type { ContextModalProps } from '@undb/ui'
import { CreateFieldForm } from './create-field-form'
import type { ICreateFieldProps } from './create-field.props'

export const CreateFieldModal = ({ innerProps }: ContextModalProps<ICreateFieldProps>) => {
  return <CreateFieldForm {...innerProps} />
}
export default CreateFieldModal
