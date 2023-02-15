import { ActionIcon, Button, List, openContextModal, Stack } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { CREATE_VIEW_MODAL_ID } from '../../modals'
import { DisplayTypeIcon, getDisplayTypeColor } from '../view/display-type-icon'
import { viewsOpenedAtom } from './views-opened.atom'

export const ViewsList: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const views = table.views.views

  const router = useRouter()

  const setOpened = useSetAtom(viewsOpenedAtom)

  return (
    <Stack h="100%" justify="space-between">
      <List center size="sm" spacing="xs">
        {views.map((v) => {
          const isActive = v.id.equals(view.id)
          return (
            <List.Item
              px="xs"
              py={5}
              bg={isActive ? 'blue.0' : ''}
              icon={
                <ActionIcon variant="filled" color={getDisplayTypeColor(v.displayType)} size="sm">
                  <DisplayTypeIcon displayType={v.displayType} size={20} />
                </ActionIcon>
              }
              key={v.id.value}
              onClick={() => {
                router.push(`/t/${table.id.value}/${v.id.value}`)
                setOpened(false)
              }}
              sx={(theme) => ({
                cursor: 'pointer',
                ':hover': { backgroundColor: !isActive ? theme.colors.gray[0] : theme.colors.blue[0] },
              })}
            >
              {v.name.value}
            </List.Item>
          )
        })}
      </List>
      <Button
        variant="light"
        onClick={() => {
          openContextModal({
            title: 'Create New View',
            modal: CREATE_VIEW_MODAL_ID,
            innerProps: {},
          })
        }}
      >
        Create New View
      </Button>
    </Stack>
  )
}
