import type { Records } from '@egodb/core'
import type { IKanbanField } from '@egodb/core'
import { Container, Center, Modal } from '@egodb/ui'
import { useAtom } from 'jotai'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanBoard } from './kanban-board'
import { openKanbanEditFieldAtom } from './kanban-edit-field.atom'
import { SelectKanbanField } from './select-kanban-field'

interface IProps extends ITableBaseProps {
  records: Records
}

export const KanbanUI: React.FC<IProps> = ({ table, records }) => {
  const view = table.mustGetView()
  const fieldId = view.kanbanFieldId
  const [opened, setOpened] = useAtom(openKanbanEditFieldAtom)

  if (fieldId.isNone()) {
    return (
      <Container h="100%" w={450}>
        <Center h="100%" w="100%">
          <SelectKanbanField table={table} />
        </Center>
      </Container>
    )
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()
  return (
    <>
      {opened && (
        <Modal
          target="body"
          withCloseButton={false}
          opened={opened}
          onClose={() => setOpened(false)}
          styles={{ modal: { padding: '0 !important' } }}
        >
          <SelectKanbanField table={table} onSuccess={() => setOpened(false)} />
        </Modal>
      )}
      <KanbanBoard table={table} field={field as IKanbanField} records={records} />{' '}
    </>
  )
}
