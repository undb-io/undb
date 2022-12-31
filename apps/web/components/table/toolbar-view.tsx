import type { IViewDisplayType } from '@egodb/core'
import { Button, Menu, SegmentedControl, Tooltip, useDisclosure } from '@egodb/ui'
import { trpc } from '../../trpc'
import { DisplayTypeIcon } from '../view/display-type-icon'
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
  )
}
