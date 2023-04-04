import { Drawer } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { ViewsList } from './views-list'
import { viewsOpenedAtom } from './views-opened.atom'

export const ViewsListDrawer = () => {
  const [opened, setOpened] = useAtom(viewsOpenedAtom)
  const { t } = useTranslation()

  return (
    <Drawer
      opened={opened}
      withinPortal
      onClose={() => setOpened(false)}
      position="left"
      size="md"
      padding="md"
      title={t('Select View')}
    >
      <ViewsList />
    </Drawer>
  )
}
