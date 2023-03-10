import type { FieldId, ITreeView, Kanban } from '@egodb/core'
import type { ICalendar } from '@egodb/core'
import {
  useDeleteViewMutation,
  useDuplicateViewMutation,
  useSwitchDisplayTypeMutation,
  useUpdateViewNameMutation,
} from '@egodb/store'
import {
  Button,
  IconCalendarPlus,
  IconSelect,
  Menu,
  useDisclosure,
  openContextModal,
  closeAllModals,
  Text,
  Group,
  IconChevronRight,
  IconCheck,
  IconCopy,
  IconPencil,
  IconSwitchHorizontal,
  IconTrash,
  TextInput,
  ActionIcon,
  IconChevronDown,
  IconTree,
} from '@egodb/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { confirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import {
  SELECT_CALENDAR_FIELD_MODAL_ID,
  SELECT_KANBAN_FIELD_MODAL_ID,
  SELECT_TREE_VIEW_FIELD_MODAL_ID,
} from '../../modals'
import type { ISelectKanbanFieldProps } from '../kanban-ui/select-kanban-field.props'
import { displayTypes } from '../view/display-type'
import { DisplayTypeIcon, getDisplayTypeColor } from '../view/display-type-icon'

const StackedBy: React.FC<{ fieldId?: FieldId }> = ({ fieldId }) => {
  const table = useCurrentTable()
  const { t } = useTranslation()

  if (!fieldId) return null

  const field = table.schema.getFieldById(fieldId.value).into()
  if (!field) return null

  return (
    <Button
      onClick={() =>
        openContextModal({
          modal: SELECT_KANBAN_FIELD_MODAL_ID,
          innerProps: { table, onSuccess: () => closeAllModals() } as ISelectKanbanFieldProps,
          withCloseButton: false,
          styles: {
            body: { padding: '0 !important', width: '100%' },
          },
        })
      }
      compact
      size="xs"
      variant="subtle"
      leftIcon={<IconSelect size={18} />}
    >
      {t('Using Field', { name: field.name.value })}
    </Button>
  )
}

const KanbanControl: React.FC<{ kanban?: Kanban }> = ({ kanban }) => {
  return (
    <>
      <StackedBy fieldId={kanban?.fieldId} />
    </>
  )
}

const UsingCalendarField: React.FC<{ fieldId?: FieldId }> = ({ fieldId }) => {
  const table = useCurrentTable()
  const { t } = useTranslation()
  if (!fieldId) return null

  const field = table.schema.getFieldById(fieldId.value).into()
  if (!field) return null

  return (
    <Button
      onClick={() =>
        openContextModal({
          modal: SELECT_CALENDAR_FIELD_MODAL_ID,
          innerProps: { table, onSucess: () => closeAllModals() },
          withCloseButton: false,
          styles: {
            body: { padding: '0 !important' },
          },
        })
      }
      compact
      variant="subtle"
      size="xs"
      leftIcon={<IconCalendarPlus size={18} />}
    >
      {t('Using Field', { name: field.name.value })}
    </Button>
  )
}

const CalendarControl: React.FC<{ calendar?: ICalendar }> = ({ calendar }) => {
  return <UsingCalendarField fieldId={calendar?.fieldId} />
}

const UsingTreeField: React.FC<{ fieldId?: FieldId }> = ({ fieldId }) => {
  const table = useCurrentTable()
  const { t } = useTranslation()
  if (!fieldId) return null

  const field = table.schema.getFieldById(fieldId.value).into()
  if (!field) return null

  return (
    <Button
      onClick={() =>
        openContextModal({
          modal: SELECT_TREE_VIEW_FIELD_MODAL_ID,
          innerProps: { onSucess: () => closeAllModals() },
          withCloseButton: false,
          styles: {
            body: { padding: '0 !important' },
          },
        })
      }
      compact
      variant="subtle"
      size="xs"
      leftIcon={<IconTree size={18} />}
    >
      {t('Using Field', { name: field.name.value })}
    </Button>
  )
}

const TreeControl: React.FC<{ tree?: ITreeView }> = ({ tree }) => {
  return <UsingTreeField fieldId={tree?.fieldId} />
}

export const ViewMenu: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const router = useRouter()
  const [opened, toggle] = useDisclosure(false)
  const [editing, toggleEditing] = useDisclosure(false)
  const [viewName, setViewName] = useState(view.name.unpack())

  const displayType = view.displayType

  const [switchDisplayType] = useSwitchDisplayTypeMutation()
  const [duplicateView] = useDuplicateViewMutation()
  const [updateViewName] = useUpdateViewNameMutation()
  const [deleteView] = useDeleteViewMutation()

  const { t } = useTranslation()

  const onUpdateViewName = async (name: string) => {
    await updateViewName({
      tableId: table.id.value,
      view: { id: view.id.value, name },
    })

    setViewName(name)
    toggleEditing.close()
  }

  const confirm = confirmModal({
    async onConfirm() {
      await deleteView({ tableId: table.id.value, id: view.id.value })
      router.push(`/t/${table.id.value}`)
    },
  })

  const canDelete = table.views.count > 1

  return (
    <Button.Group>
      <Menu width={250} disabled={editing} opened={opened} closeOnClickOutside onClose={toggle.close} shadow="md">
        <Menu.Target>
          <Button
            size="xs"
            compact
            variant="subtle"
            onClick={toggle.toggle}
            leftIcon={<DisplayTypeIcon displayType={view.displayType} />}
            rightIcon={<IconChevronDown size={14} />}
            sx={(theme) => ({
              '&[data-expanded]': {
                backgroundColor: theme.colors[theme.primaryColor][0],
              },
            })}
          >
            {editing ? (
              <TextInput
                defaultValue={viewName}
                onBlur={(event) => onUpdateViewName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onUpdateViewName((event.target as any).value)
                  }
                }}
                size="xs"
                autoFocus
              />
            ) : (
              viewName
            )}
          </Button>
        </Menu.Target>

        <Menu.Dropdown w={300}>
          <Menu.Item p={0}>
            <Menu trigger="hover" openDelay={50} closeDelay={100} position="right-start">
              <Menu.Target>
                <Group position="apart" noWrap p="xs">
                  <Group spacing="xs">
                    <IconSwitchHorizontal color="gray" size={16} />
                    <Text size="xs">{t('Select Display Type')}</Text>
                  </Group>
                  <IconChevronRight size={16} />
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                {displayTypes.map((d) => (
                  <Menu.Item
                    w={180}
                    h={35}
                    fz="xs"
                    key={d.value}
                    onClick={() => {
                      switchDisplayType({
                        tableId: table.id.value,
                        viewId: view.id.value,
                        displayType: d.value,
                      })
                    }}
                  >
                    <Group w="100%">
                      <Group sx={{ flex: 1 }}>
                        <ActionIcon size="xs" variant="filled" color={getDisplayTypeColor(d.value)}>
                          <DisplayTypeIcon displayType={d.value} size={18} />
                        </ActionIcon>
                        <Text color="gray.8">{t(d.label)}</Text>
                      </Group>

                      {d.value === view.displayType && <IconCheck color="gray" size={18} />}
                    </Group>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item fz="xs" color="gray.9" icon={<IconPencil color="gray" size={16} />} onClick={toggleEditing.open}>
            {t('Update View Name')}
          </Menu.Item>
          <Menu.Item
            fz="xs"
            color="gray.9"
            icon={<IconCopy color="gray" size={16} />}
            onClick={() => {
              duplicateView({ tableId: table.id.value, id: view.id.value })
            }}
          >
            {t('Duplicate View')}
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item disabled={!canDelete} icon={<IconTrash size={16} />} color="red.9" fz="xs" onClick={confirm}>
            {t('Delete View')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {displayType === 'kanban' ? <KanbanControl kanban={view.kanban.into()} /> : null}
      {displayType === 'calendar' ? <CalendarControl calendar={view.calendar.into()} /> : null}
      {displayType === 'tree' ? <TreeControl tree={view.treeView.into()} /> : null}
    </Button.Group>
  )
}
