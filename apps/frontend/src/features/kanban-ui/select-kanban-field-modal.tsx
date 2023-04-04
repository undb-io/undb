import type { ContextModalProps } from '@egodb/ui'
import { SelectKanbanField } from './select-kanban-field'
import type { ISelectKanbanFieldProps } from './select-kanban-field.props'

export const SelectKanbanFieldModal = ({ innerProps }: ContextModalProps<ISelectKanbanFieldProps>) => (
  <SelectKanbanField {...innerProps} />
)
