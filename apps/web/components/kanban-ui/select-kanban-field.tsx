import { Center, Container } from '@egodb/ui'
import { useAtomValue } from 'jotai'
import type { ITableBaseProps } from '../table/table-base-props'
import { CreateSelectField } from './create-select-field'
import { stepAtom } from './kanban-step.atom'
import { SelectExistingField } from './select-existing-field'

export const SelectKanbanField: React.FC<ITableBaseProps> = ({ table }) => {
  const step = useAtomValue(stepAtom)

  return (
    <Container h="100%">
      <Center h="100%">
        {step === 0 ? <SelectExistingField table={table} /> : null}
        {step === 1 ? <CreateSelectField table={table} /> : null}
      </Center>
    </Container>
  )
}
