import type { ITreeViewField } from '@egodb/core'
import { Container, Center } from '@egodb/ui'
import type { ITableBaseProps } from '../table/table-base-props'
import { SelectTreeViewField } from './select-tree-view-field'
import { TreeViewBoard } from './tree-view-board'

export const TreeViewUI: React.FC<ITableBaseProps> = ({ table }) => {
  const view = table.mustGetView()
  const fieldId = view.treeViewFieldId

  if (fieldId.isNone()) {
    return (
      <Container h="100%" w={450} sx={{ overflow: 'scroll' }}>
        <Center pb={200} h="100%" w="100%" sx={{ overflow: 'scroll' }}>
          <SelectTreeViewField table={table} />
        </Center>
      </Container>
    )
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()

  return <TreeViewBoard table={table} field={field as ITreeViewField} />
}
