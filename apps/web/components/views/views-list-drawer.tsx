import { Drawer } from '@egodb/ui'
import { useAtom } from 'jotai'
import { ViewsList } from './views-list'
import { viewsOpenedAtom } from './views-opened.atom'

export const ViewsListDrawer = () => {
  const [opened, setOpened] = useAtom(viewsOpenedAtom)
  return (
    <Drawer
      opened={opened}
      withinPortal
      onClose={() => setOpened(false)}
      position="left"
      size="md"
      padding="md"
      title="select view"
    >
      <ViewsList />
    </Drawer>
  )
}
