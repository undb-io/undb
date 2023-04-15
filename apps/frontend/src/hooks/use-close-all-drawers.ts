import { useSetAtom } from 'jotai'
import { createRecordFormDrawerOpened } from '../features/create-record-form/drawer-opened.atom'
import { createTableFormDrawerOpened } from '../features/create-table-form/drawer-opened.atom'
import { updateTableFormDrawerOpened } from '../features/update-table-form/drawer-opened.atom'
import { viewsOpenedAtom } from '../features/views/views-opened.atom'

export const useCloseAllDrawers = () => {
  const setCreateTableDrawerOpened = useSetAtom(createTableFormDrawerOpened)
  const setCreateRecordDrawerOpened = useSetAtom(createRecordFormDrawerOpened)
  const setViewListDrawerOpened = useSetAtom(viewsOpenedAtom)
  const setUpdateTableDrawerOpened = useSetAtom(updateTableFormDrawerOpened)

  return () => {
    setCreateTableDrawerOpened(false)
    setCreateRecordDrawerOpened(false)
    setUpdateTableDrawerOpened(false)
    setViewListDrawerOpened(false)
  }
}
