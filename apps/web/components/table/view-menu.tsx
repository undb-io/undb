import type { FieldId, Kanban } from '@egodb/core'
import type { ICalendar } from '@egodb/core/view/calendar'
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
  Tooltip,
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
} from '@egodb/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useConfirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { SELECT_CALENDAR_FIELD_MODAL_ID, SELECT_KANBAN_FIELD_MODAL_ID } from '../../modals'
import type { ISelectKanbanFieldProps } from '../kanban-ui/select-kanban-field.props'
import { displayTypes } from '../view/display-type'
import { DisplayTypeIcon } from '../view/display-type-icon'

const StackedBy: React.FC<{ fieldId?: FieldId }> = ({ fieldId }) => {
  const table = useCurrentTable()

  if (!fieldId) return null

  const field = table.schema.getFieldById(fieldId.value).into()
  if (!field) return null

  return (
    <Tooltip label="stacked by">
      <Button
        onClick={() =>
          openContextModal({
            modal: SELECT_KANBAN_FIELD_MODAL_ID,
            innerProps: { table, onSuccess: () => closeAllModals() } as ISelectKanbanFieldProps,
            withCloseButton: false,
            styles: {
              modal: { padding: '0 !important' },
            },
          })
        }
        compact
        size="xs"
        variant="subtle"
        leftIcon={<IconSelect size={18} />}
      >{`stacked by "${field.name.value}"`}</Button>
    </Tooltip>
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
  if (!fieldId) return null

  const field = table.schema.getFieldById(fieldId.value).into()
  if (!field) return null

  return (
    <Tooltip label="stacked by">
      <Button
        onClick={() =>
          openContextModal({
            modal: SELECT_CALENDAR_FIELD_MODAL_ID,
            innerProps: { table, onSucess: () => closeAllModals() },
            withCloseButton: false,
            styles: {
              modal: { padding: '0 !important' },
            },
          })
        }
        compact
        variant="subtle"
        size="xs"
        leftIcon={<IconCalendarPlus size={18} />}
      >{`using "${field.name.value}" field`}</Button>
    </Tooltip>
  )
}

const CalendarControl: React.FC<{ calendar?: ICalendar }> = ({ calendar }) => {
  return <UsingCalendarField fieldId={calendar?.fieldId} />
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

  const onUpdateViewName = async (name: string) => {
    await updateViewName({
      tableId: table.id.value,
      view: { id: view.id.value, name },
    })

    setViewName(name)
    toggleEditing.close()
  }

  const confirm = useConfirmModal({
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
          <Tooltip label={view.displayType}>
            <Button
              size="xs"
              compact
              variant="subtle"
              onClick={toggle.toggle}
              leftIcon={<DisplayTypeIcon displayType={view.displayType} />}
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
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown w={300}>
          <Menu.Item>
            <Menu trigger="hover" openDelay={100} closeDelay={100} position="right-start">
              <Menu.Target>
                <Group position="apart" noWrap>
                  <Menu.Item icon={<IconSwitchHorizontal color="gray" size={16} />} fz="xs" color="gray.9" p={0}>
                    Select Display Type
                  </Menu.Item>
                  <IconChevronRight size={16} />
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                {displayTypes.map((d) => (
                  <Menu.Item
                    w={180}
                    h={35}
                    fz="xs"
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
                        <DisplayTypeIcon displayType={d.value} size={18} color="gray" />
                        <Text color="gray.8">{d.label}</Text>
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
            Update View Name
          </Menu.Item>
          <Menu.Item
            fz="xs"
            color="gray.9"
            icon={<IconCopy color="gray" size={16} />}
            onClick={() => {
              duplicateView({ tableId: table.id.value, id: view.id.value })
            }}
          >
            Duplicate View
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item disabled={!canDelete} icon={<IconTrash size={16} />} color="red.9" fz="xs" onClick={confirm}>
            Delete View
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {displayType === 'kanban' ? <KanbanControl kanban={view.kanban.into()} /> : null}
      {displayType === 'calendar' ? <CalendarControl calendar={view.calendar.into()} /> : null}
    </Button.Group>
  )
}
