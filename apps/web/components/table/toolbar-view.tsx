import type { IViewDisplayType, Kanban } from '@egodb/core'
import type { FieldId } from '@egodb/core'
import type { Table } from '@egodb/core'
import type { ICalendar } from '@egodb/core/view/calendar'
import {
  Button,
  IconCalendarPlus,
  IconSelect,
  Popover,
  Modal,
  SegmentedControl,
  Tooltip,
  useDisclosure,
} from '@egodb/ui'
import { useAtom, useSetAtom } from 'jotai'
import { trpc } from '../../trpc'
import { openCalendarEditField, openCalendarEditFieldAtom } from '../calendar-ui/calendar-edit-field.atom'
import { SelectCalendarField } from '../calendar-ui/select-calendar-field'
import { openKanbanEditField } from '../kanban-ui/kanban-edit-field.atom'
import { DisplayTypeIcon } from '../view/display-type-icon'
import type { ITableBaseProps } from './table-base-props'

const StackedBy: React.FC<{ fieldId?: FieldId; table: Table }> = ({ table, fieldId }) => {
  const setOpened = useSetAtom(openKanbanEditField)
  if (!fieldId) return null

  const field = table.schema.getFieldById(fieldId.value).into()
  if (!field) return null

  return (
    <Tooltip label="stacked by">
      <Button
        onClick={setOpened}
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
      <StackedBy fieldId={kanban?.fieldId} table={table} />
    </>
  )
}

const UsingCalendarField: React.FC<{ fieldId?: FieldId; table: Table }> = ({ table, fieldId }) => {
  const setOpened = useSetAtom(openCalendarEditField)
  if (!fieldId) return null

  const field = table.schema.getFieldById(fieldId.value).into()
  if (!field) return null

  return (
    <Tooltip label="stacked by">
      <Button
        onClick={setOpened}
        compact
        variant="subtle"
        size="xs"
        leftIcon={<IconCalendarPlus size={18} />}
      >{`using "${field.id.value}" field`}</Button>
    </Tooltip>
  )
}

const CalendarControl: React.FC<{ table: Table; calendar?: ICalendar }> = ({ table, calendar }) => {
  const [opened, setOpened] = useAtom(openCalendarEditFieldAtom)
  return (
    <>
      {opened && (
        <Modal
          target="body"
          withCloseButton={false}
          opened={opened}
          onClose={() => setOpened(false)}
          styles={{
            modal: {
              padding: '0 !important',
            },
          }}
        >
          <SelectCalendarField table={table} onSuccess={() => setOpened(false)} />
        </Modal>
      )}

      <UsingCalendarField fieldId={calendar?.fieldId} table={table} />
    </>
  )
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
                viewId: view.name.unpack(),
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
