import { Button, IconPlus } from '@egodb/ui'
import { useAtom } from 'jotai'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'

export const TableCreateNewRecordButton: React.FC = () => {
  const [, setOpened] = useAtom(createRecordFormDrawerOpened)
  return (
    <Button size="xs" leftIcon={<IconPlus size={14} />} onClick={() => setOpened(true)}>
      Add New Record
    </Button>
  )
}
