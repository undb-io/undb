import { ActionIcon, IconSettings } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { updateTableFormDrawerOpened } from '../update-table-form/drawer-opened.atom'

export const UpdateTableButton: React.FC = () => {
  const setOpened = useSetAtom(updateTableFormDrawerOpened)

  return (
    <ActionIcon radius="xl" variant="subtle" size="lg" onClick={() => setOpened(true)}>
      <IconSettings size={18} />
    </ActionIcon>
  )
}
