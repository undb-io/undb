import { Button, IconFilter, Popover, useDisclosure } from '@egodb/ui'
import { trpc } from '../../trpc'
import { FiltersEditor } from '../filters-editor/filters-editor'
import type { ITableBaseProps } from './table-base-props'

export const TableFilterEditor: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, handler] = useDisclosure(false)

  const utils = trpc.useContext()

  const setFilters = trpc.table.setFilters.useMutation({
    onSuccess: () => {
      handler.close()

      utils.table.get.refetch({ id: table.id.value })
      utils.record.list.refetch({ tableId: table.id.value })
    },
  })

  return (
    <Popover position="bottom-start" opened={opened} onChange={handler.toggle} closeOnClickOutside>
      <Popover.Target>
        <Button variant="white" leftIcon={<IconFilter size={18} />} onClick={handler.toggle}>
          Filter
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <FiltersEditor
          table={table}
          onApply={(filters) => {
            setFilters.mutate({ tableId: table.id.value, filters })
          }}
          onCancel={handler.close}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
