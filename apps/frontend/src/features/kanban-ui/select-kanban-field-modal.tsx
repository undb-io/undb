import type { ContextModalProps } from '@undb/ui'
import { SelectKanbanField } from './select-kanban-field'
import type { ISelectKanbanFieldProps } from './select-kanban-field.props'

export const SelectKanbanFieldModal = ({ innerProps }: ContextModalProps<ISelectKanbanFieldProps>) => (
  <SelectKanbanField {...innerProps} />
)

export default SelectKanbanFieldModal
