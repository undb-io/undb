import type { FieldId, IViewDisplayType, Kanban } from '@egodb/core'
import type { ICalendar } from '@egodb/core/view/calendar'
import { useSwitchDisplayTypeMutation } from '@egodb/store'
import {
  Button,
  IconCalendarPlus,
  IconSelect,
  Popover,
  SegmentedControl,
  Tooltip,
  useDisclosure,
  openContextModal,
  closeAllModals,
} from '@egodb/ui'
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

export const ToolbarView: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const [opened, toggle] = useDisclosure(false)

  const displayType = view.displayType

  const [switchDisplayType] = useSwitchDisplayTypeMutation()

  return (
    <Button.Group>
      <Popover opened={opened} closeOnClickOutside onClose={toggle.close} shadow="md">
        <Popover.Target>
          <Tooltip label={view.displayType}>
            <Button
              size="xs"
              compact
              variant="subtle"
              onClick={toggle.toggle}
              leftIcon={<DisplayTypeIcon displayType={view.displayType} />}
            >
              {view.name.unpack()}
            </Button>
          </Tooltip>
        </Popover.Target>

        <Popover.Dropdown p="xs">
          <SegmentedControl
            data={displayTypes}
            onChange={(type) => {
              switchDisplayType({
                tableId: table.id.value,
                viewId: view.id.value,
                displayType: type as IViewDisplayType,
              }).then(() => {
                toggle.close()
              })
            }}
            value={view.displayType}
            defaultValue={view.displayType}
          />
        </Popover.Dropdown>
      </Popover>

      {displayType === 'kanban' ? <KanbanControl kanban={view.kanban.into()} /> : null}
      {displayType === 'calendar' ? <CalendarControl calendar={view.calendar.into()} /> : null}
    </Button.Group>
  )
}
