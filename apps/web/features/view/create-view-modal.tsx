import type { ContextModalProps } from '@egodb/ui'
import { CreateViewForm } from './create-view-form'

export const CreateViewModal = ({ innerProps }: ContextModalProps) => {
  return <CreateViewForm {...innerProps} />
}
