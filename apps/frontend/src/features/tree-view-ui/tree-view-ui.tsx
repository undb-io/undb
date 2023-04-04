import type { ITreeViewField } from '@egodb/core'
import { Box, Overlay } from '@egodb/ui'
import dynamic from 'next/dynamic'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { SelectTreeViewField } from './select-tree-view-field'

const TreeViewBoard = dynamic(() => import('./tree-view-board').then((d) => d.TreeViewBoard))

export const TreeViewUI: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const fieldId = view.treeViewFieldId

  if (fieldId.isNone()) {
    return (
      <Box h="100%" sx={{ position: 'relative' }}>
        <Overlay center>
          <Box w={500}>
            <SelectTreeViewField />
          </Box>
        </Overlay>
      </Box>
    )
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()

  return <TreeViewBoard field={field as ITreeViewField} />
}
