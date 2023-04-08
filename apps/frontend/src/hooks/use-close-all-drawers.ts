import { resetSelectedRecordId } from '@undb/store'
import { useSetAtom } from 'jotai'
import { useDispatch } from 'react-redux'
import { createRecordFormDrawerOpened } from '../features/create-record-form/drawer-opened.atom'
import { createTableFormDrawerOpened } from '../features/create-table-form/drawer-opened.atom'
import { updateTableFormDrawerOpened } from '../features/update-table-form/drawer-opened.atom'
import { viewsOpenedAtom } from '../features/views/views-opened.atom'

export const useCloseAllDrawers = () => {
  const setCreateTableDrawerOpened = useSetAtom(createTableFormDrawerOpened)
  const setCreateRecordDrawerOpened = useSetAtom(createRecordFormDrawerOpened)
  const setViewListDrawerOpened = useSetAtom(viewsOpenedAtom)
  const setUpdateTableDrawerOpened = useSetAtom(updateTableFormDrawerOpened)
  const dispatch = useDispatch()

  return () => {
    setCreateTableDrawerOpened(false)
    setCreateRecordDrawerOpened(false)
    setUpdateTableDrawerOpened(false)
    setViewListDrawerOpened(false)
    dispatch(resetSelectedRecordId())
  }
}
