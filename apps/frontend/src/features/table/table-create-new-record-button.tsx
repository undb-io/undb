import { resetSelectedRecordId } from '@egodb/store'
import { Button, IconRowInsertBottom } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { unstable_batchedUpdates } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../hooks'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'

export const TableCreateNewRecordButton: React.FC = () => {
  const setOpened = useSetAtom(createRecordFormDrawerOpened)
  const setCreateRecordInitialValue = useSetAtom(createRecordInitialValueAtom)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  return (
    <Button
      compact
      size="xs"
      leftIcon={<IconRowInsertBottom size={14} />}
      onClick={() => {
        unstable_batchedUpdates(() => {
          setCreateRecordInitialValue({})
          setOpened(true)
          dispatch(resetSelectedRecordId())
        })
      }}
    >
      {t('Create New Record')}
    </Button>
  )
}
