import { ActionIcon, IconSettings } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { editTableFormDrawerOpened } from '../edit-table-form/drawer-opened.atom'

export const EditTableButton: React.FC = () => {
  const setOpened = useSetAtom(editTableFormDrawerOpened)

  return (
    <ActionIcon radius="xl" variant="subtle" size="lg" onClick={() => setOpened(true)}>
      <IconSettings size={18} />
    </ActionIcon>
  )
}
