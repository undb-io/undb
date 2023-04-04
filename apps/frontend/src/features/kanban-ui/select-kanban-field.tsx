import { Box } from '@egodb/ui'
import { useAtomValue } from 'jotai'
import { CreateDateField } from './create-date-field'
import { CreateSelectField } from './create-select-field'
import { kanbanStepAtom } from './kanban-step.atom'
import { SelectExistingField } from './select-existing-kanban-field'
import type { ISelectKanbanFieldProps } from './select-kanban-field.props'

export const SelectKanbanField: React.FC<ISelectKanbanFieldProps> = ({ onSuccess }) => {
  const step = useAtomValue(kanbanStepAtom)

  return (
    <Box w="100%">
      {step === 0 ? <SelectExistingField onSuccess={onSuccess} /> : null}
      {step === 1 ? <CreateSelectField onSuccess={onSuccess} /> : null}
      {step === 2 ? <CreateDateField onSuccess={onSuccess} /> : null}
    </Box>
  )
}
