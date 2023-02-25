import type { ITreeViewField } from '@egodb/core'
import { Container, Center } from '@egodb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { SelectTreeViewField } from './select-tree-view-field'
import { TreeViewBoard } from './tree-view-board'

export const TreeViewUI: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const fieldId = view.treeViewFieldId

  if (fieldId.isNone()) {
    return (
      <Container h="100%" w={450} sx={{ overflow: 'scroll' }}>
        <Center pb={200} h="100%" w="100%" sx={{ overflow: 'scroll' }}>
          <SelectTreeViewField />
        </Center>
      </Container>
    )
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()

  return <TreeViewBoard field={field as ITreeViewField} />
}
