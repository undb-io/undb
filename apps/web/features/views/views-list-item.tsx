import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  IconGripVertical,
  Box,
  IconTrash,
  IconCopy,
  IconPencil,
} from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { confirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { getDisplayTypeColor, DisplayTypeIcon } from '../view/display-type-icon'
import { viewsOpenedAtom } from './views-opened.atom'

export interface IProps {
  v: View
}

export const ViewsListItem: React.FC<IProps> = ({ v }) => {
  const table = useCurrentTable()
  const viewCount = table.views.count
  const view = useCurrentView()
  const isActive = view.id.equals(v.id)
  const router = useRouter()
  const [isEditing, handler] = useDisclosure(false)

  const { t } = useTranslation()

  const { ref, hovered } = useHover()

  const setOpened = useSetAtom(viewsOpenedAtom)

  const [updateViewName] = useUpdateViewNameMutation()
  const [duplicateView] = useDuplicateViewMutation()

  const [deleteView] = useDeleteViewMutation()
  const confirm = confirmModal({
    async onConfirm() {
      await deleteView({ tableId: table.id.value, id: v.id.value })
      router.replace(`/t/${table.id.value}`)
      setOpened(false)
    },
  })

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: v.id.value })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Box ref={setNodeRef} style={style}>
      <Group
        data-view-id={v.id.value}
        noWrap
        position="apart"
        p="xs"
        ref={ref}
        bg={isActive ? 'blue.0' : ''}
        key={v.id.value}
        onClick={() => {
          if (!isActive) {
            router.push(`/t/${table.id.value}/${v.id.value}`)
          }
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
                size="xs"
                lh={1}
                defaultValue={v.name.value}
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
        <Group spacing={5} sx={{ visibility: hovered ? 'visible' : 'hidden' }}>
          <Menu withinPortal closeOnClickOutside closeOnItemClick>
            <Menu.Target>
              <ActionIcon
                color="gray.5"
                size={12}
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
                h={35}
                fz="xs"
                icon={<IconPencil size={14} />}
                onClick={(e) => {
                  e.stopPropagation()
                  handler.open()
                }}
              >
                {t('Update View Name')}
              </Menu.Item>
              <Menu.Item
                h={35}
                fz="xs"
                icon={<IconCopy size={14} />}
                onClick={(e) => {
                  e.stopPropagation()
                  duplicateView({ tableId: table.id.value, id: v.id.value })
                }}
              >
                {t('Duplicate View')}
              </Menu.Item>

              {viewCount > 1 && (
                <>
                  <Menu.Divider />

                  <Menu.Item
                    h={35}
                    fz="xs"
                    icon={<IconTrash size={14} />}
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation()
                      confirm()
                    }}
                  >
                    {t('Delete View')}
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>

          <ActionIcon {...attributes} {...listeners} size="xs" component="a">
            <IconGripVertical size={12} />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  )
}
