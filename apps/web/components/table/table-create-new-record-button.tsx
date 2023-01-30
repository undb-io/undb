import { Button, IconRowInsertBottom } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { unstable_batchedUpdates } from 'react-dom'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import { editRecordFormDrawerOpened } from '../edit-record-form/drawer-opened.atom'

export const TableCreateNewRecordButton: React.FC = () => {
  const setOpened = useSetAtom(createRecordFormDrawerOpened)
  const setEditRecordOpened = useSetAtom(editRecordFormDrawerOpened)
  const setCreateRecordInitialValue = useSetAtom(createRecordInitialValueAtom)

  return (
    <Button
      compact
      size="xs"
      leftIcon={<IconRowInsertBottom size={14} />}
      onClick={() => {
        unstable_batchedUpdates(() => {
          setCreateRecordInitialValue({})
          setEditRecordOpened(false)
          setOpened(true)
        })
      }}
    >
      Add New Record
    </Button>
  )
}
