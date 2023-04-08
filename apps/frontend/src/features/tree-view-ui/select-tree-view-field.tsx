import { Box } from '@undb/ui'
import { useAtomValue } from 'jotai'
import { CreateTreeField } from './create-tree-field'
import { SelectExistingField } from './select-existing-tree-view-field'
import type { ISelectTreeViewFieldProps } from './select-tree-view-field.props'
import { treeStepAtom } from './tree-step.atom'

export const SelectTreeViewField: React.FC<ISelectTreeViewFieldProps> = ({ onSuccess }) => {
  const step = useAtomValue(treeStepAtom)

  return (
    <Box w="100%">
      {step === 0 ? <SelectExistingField onSuccess={onSuccess} /> : null}
      {step === 1 ? <CreateTreeField onSuccess={onSuccess} /> : null}
    </Box>
  )
}
