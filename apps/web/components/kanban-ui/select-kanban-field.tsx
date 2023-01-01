import { useAtomValue } from 'jotai'
import type { ITableBaseProps } from '../table/table-base-props'
import { CreateSelectField } from './create-select-field'
import { stepAtom } from './kanban-step.atom'
import { SelectExistingField } from './select-existing-field'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const SelectKanbanField: React.FC<IProps> = ({ table, onSuccess }) => {
  const step = useAtomValue(stepAtom)

  return (
    <>
      {step === 0 ? <SelectExistingField onSuccess={onSuccess} table={table} /> : null}
      {step === 1 ? <CreateSelectField onSuccess={onSuccess} table={table} /> : null}
    </>
  )
}
