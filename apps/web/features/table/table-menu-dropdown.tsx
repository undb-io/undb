import { IconPencil, Menu } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { updateTableFormDrawerOpened } from '../update-table-form/drawer-opened.atom'

export const TableMenuDropdown: React.FC = () => {
  const { t } = useTranslation()
  const setOpened = useSetAtom(updateTableFormDrawerOpened)

  return (
    <>
      <Menu.Item
        fz="xs"
        icon={<IconPencil size={14} />}
        onClick={() => {
          setOpened(true)
        }}
      >
        {t('Update Table')}
      </Menu.Item>
    </>
  )
}
