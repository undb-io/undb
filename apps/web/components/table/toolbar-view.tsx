import type { IViewDisplayType, Kanban } from '@egodb/core'
import type { FieldId } from '@egodb/core'
import type { Table } from '@egodb/core'
import { Button, IconSelect, Menu, SegmentedControl, Tooltip, useDisclosure } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { trpc } from '../../trpc'
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
        variant="subtle"
        leftIcon={<IconSelect size={18} />}
      >{`stacked by ${field.name.value}`}</Button>
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

export const ToolbarView: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, toggle] = useDisclosure(false)
  const view = table.mustGetView()

  const displayType = view.displayType

  const utils = trpc.useContext()
  const switchDisplayType = trpc.table.switchDisplayType.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      toggle.close()
    },
  })

  return (
    <Button.Group>
      <Menu opened={opened} closeOnItemClick closeOnClickOutside onClose={toggle.close}>
        <Menu.Target>
          <Tooltip label={view.displayType}>
            <Button
              compact
              variant="subtle"
              onClick={toggle.toggle}
              leftIcon={<DisplayTypeIcon displayType={view.displayType} />}
            >
              {view.name.unpack()}
            </Button>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <SegmentedControl
            data={[
              { label: 'Grid', value: 'grid' },
              { label: 'Kanban', value: 'kanban' },
            ]}
            onChange={(type) => {
              switchDisplayType.mutate({
                tableId: table.id.value,
                viewName: view.name.unpack(),
                displayType: type as IViewDisplayType,
              })
            }}
            value={view.displayType}
            defaultValue={view.displayType}
          />
        </Menu.Dropdown>
      </Menu>

      {displayType === 'kanban' ? <KanbanControl table={table} kanban={view.kanban.into()} /> : null}
    </Button.Group>
  )
}
