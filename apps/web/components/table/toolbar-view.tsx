import type { IViewDisplayType, Kanban } from '@egodb/core'
import type { FieldKey } from '@egodb/core'
import type { Table } from '@egodb/core'
import type { ICalendar } from '@egodb/core/view/calendar'
import {
  Button,
  IconCalendarPlus,
  IconSelect,
  Popover,
  SegmentedControl,
  Tooltip,
  useDisclosure,
  openContextModal,
  closeModal,
} from '@egodb/ui'
import { SELECT_CALENDAR_FIELD_MODAL_ID, SELECT_KANBAN_FIELD_MODAL_ID } from '../../modals'
import { trpc } from '../../trpc'
import { DisplayTypeIcon } from '../view/display-type-icon'
import type { ITableBaseProps } from './table-base-props'

const StackedBy: React.FC<{ fieldKey?: FieldKey; table: Table }> = ({ table, fieldKey }) => {
  if (!fieldKey) return null

  const field = table.schema.getFieldById(fieldKey.value).into()
  if (!field) return null

  return (
    <Tooltip label="stacked by">
      <Button
        onClick={() =>
          openContextModal({
            modal: SELECT_KANBAN_FIELD_MODAL_ID,
            innerProps: { table },
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
      >{`stacked by "${field.id.value}"`}</Button>
    </Tooltip>
  )
}

const KanbanControl: React.FC<{ table: Table; kanban?: Kanban }> = ({ table, kanban }) => {
  return (
    <>
      <StackedBy fieldKey={kanban?.fieldKey} table={table} />
    </>
  )
}

const UsingCalendarField: React.FC<{ fieldKey?: FieldKey; table: Table }> = ({ table, fieldKey }) => {
  if (!fieldKey) return null

  const field = table.schema.getFieldById(fieldKey.value).into()
  if (!field) return null

  return (
    <Tooltip label="stacked by">
      <Button
        onClick={() =>
          openContextModal({
            modal: SELECT_CALENDAR_FIELD_MODAL_ID,
            innerProps: { table, onSucess: () => closeModal(SELECT_CALENDAR_FIELD_MODAL_ID) },
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
      >{`using "${field.id.value}" field`}</Button>
    </Tooltip>
  )
}

const CalendarControl: React.FC<{ table: Table; calendar?: ICalendar }> = ({ table, calendar }) => {
  return <UsingCalendarField fieldKey={calendar?.fieldKey} table={table} />
}

export const ToolbarView: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, toggle] = useDisclosure(false)
  const view = table.mustGetView()

  const displayType = view.displayType

  const utils = trpc.useContext()
  const switchDisplayType = trpc.table.view.switchDisplayType.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      toggle.close()
    },
  })

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
            data={[
              { label: 'Grid', value: 'grid' },
              { label: 'Kanban', value: 'kanban' },
              { label: 'Calendar', value: 'calendar' },
            ]}
            onChange={(type) => {
              switchDisplayType.mutate({
                tableId: table.id.value,
                viewKey: view.name.unpack(),
                displayType: type as IViewDisplayType,
              })
            }}
            value={view.displayType}
            defaultValue={view.displayType}
          />
        </Popover.Dropdown>
      </Popover>

      {displayType === 'kanban' ? <KanbanControl table={table} kanban={view.kanban.into()} /> : null}
      {displayType === 'calendar' ? <CalendarControl table={table} calendar={view.calendar.into()} /> : null}
    </Button.Group>
  )
}
