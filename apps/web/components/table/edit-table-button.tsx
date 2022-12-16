import { ActionIcon, IconSettings } from '@egodb/ui'
import { useUpdateAtom } from 'jotai/utils'
import { editTableFormDrawerOpened } from '../edit-table-form/drawer-opened.atom'

export const EditTableButton: React.FC = () => {
  const setOpened = useUpdateAtom(editTableFormDrawerOpened)

  return (
    <ActionIcon radius="xl" variant="subtle" size="lg" onClick={() => setOpened(true)}>
      <IconSettings size={18} />
    </ActionIcon>
  )
}
