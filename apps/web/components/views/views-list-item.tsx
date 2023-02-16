import type { View } from '@egodb/core'
import { useDeleteViewMutation, useDuplicateViewMutation, useUpdateViewNameMutation } from '@egodb/store'
import {
  ActionIcon,
  useDisclosure,
  Group,
  Text,
  Menu,
  TextInput,
  FocusTrap,
  useHover,
  IconChevronDown,
} from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useConfirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { getDisplayTypeColor, DisplayTypeIcon } from '../view/display-type-icon'
import { viewsOpenedAtom } from './views-opened.atom'

export const ViewsListItem: React.FC<{ v: View }> = ({ v }) => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const isActive = view.id.equals(v.id)
  const router = useRouter()
  const [isEditing, handler] = useDisclosure(false)

  const { ref, hovered } = useHover()

  const setOpened = useSetAtom(viewsOpenedAtom)

  const [updateViewName] = useUpdateViewNameMutation()
  const [duplicateView] = useDuplicateViewMutation()

  const [deleteView] = useDeleteViewMutation()
  const confirm = useConfirmModal({
    async onConfirm() {
      await deleteView({ tableId: table.id.value, id: v.id.value })
      router.replace(`/t/${table.id.value}`)
      setOpened(false)
    },
  })

  return (
    <Group
      noWrap
      position="apart"
      p="xs"
      ref={ref}
      bg={isActive ? 'blue.0' : ''}
      key={v.id.value}
      onClick={() => {
        router.push(`/t/${table.id.value}/${v.id.value}`)
        setOpened(false)
      }}
      sx={(theme) => ({
        cursor: 'pointer',
        ':hover': {
          backgroundColor: !isActive ? theme.colors.gray[0] : theme.colors.blue[1],
        },
      })}
    >
      <Group>
        <ActionIcon variant="filled" color={getDisplayTypeColor(v.displayType)} size="sm">
          <DisplayTypeIcon displayType={v.displayType} size={20} />
        </ActionIcon>
        {isEditing ? (
          <FocusTrap>
            <TextInput
              onBlur={(e) => {
                updateViewName({
                  tableId: table.id.value,
                  view: { id: v.id.value, name: e.target.value },
                })
                setOpened(false)
              }}
              placeholder={v.name.value}
              size="xs"
              lh={1}
              onClick={(e) => e.stopPropagation()}
              variant="unstyled"
            />
          </FocusTrap>
        ) : (
          <Text fz="sm" color="gray.9">
            {v.name.value}
          </Text>
        )}
      </Group>
      {hovered && (
        <Group>
          <Menu>
            <Menu.Target>
              <ActionIcon
                color="gray.4"
                size="xs"
                variant="filled"
                radius="xl"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <IconChevronDown fontWeight={600} size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation()
                  handler.open()
                }}
              >
                Update View Name
              </Menu.Item>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation()
                  duplicateView({ tableId: table.id.value, id: v.id.value })
                }}
              >
                Duplicate View
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                color="red"
                onClick={(e) => {
                  e.stopPropagation()
                  confirm()
                }}
              >
                Delete View
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      )}
    </Group>
  )
}
