import type { IViewDisplayType } from '@egodb/core'
import { Button, Menu, SegmentedControl, useDisclosure } from '@egodb/ui'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from './table-base-props'

export const ToolbarView: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, toggle] = useDisclosure(false)
  const view = table.mustGetView()
  const utils = trpc.useContext()
  const switchDisplayType = trpc.table.switchDisplayType.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      toggle.close()
    },
  })

  return (
    <Menu opened={opened} closeOnItemClick closeOnClickOutside onClose={toggle.close}>
      <Menu.Target>
        <Button compact variant="subtle" onClick={toggle.toggle}>
          {view.name.unpack()}
        </Button>
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
  )
}
