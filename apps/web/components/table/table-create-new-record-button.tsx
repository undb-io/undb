import { Button, IconRowInsertBottom } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'

export const TableCreateNewRecordButton: React.FC = () => {
  const setOpened = useSetAtom(createRecordFormDrawerOpened)
  return (
    <Button size="xs" leftIcon={<IconRowInsertBottom size={14} />} onClick={() => setOpened(true)}>
      Add New Record
    </Button>
  )
}
