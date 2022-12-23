import { IFilter } from '@egodb/core'
import { Button, IconFilter, Popover, useDisclosure, Badge } from '@egodb/ui'
import { trpc } from '../../trpc'
import { FiltersEditor } from '../filters-editor/filters-editor'
import type { ITableBaseProps } from './table-base-props'

export const TableFilterEditor: React.FC<ITableBaseProps> = ({ table }) => {
  const filters = table.mustGetView().filterList as IFilter[]
  const [opened, handler] = useDisclosure(false)

  const utils = trpc.useContext()

  const setFilter = trpc.table.setFilter.useMutation({
    onSuccess: () => {
      handler.close()

      utils.table.get.refetch({ id: table.id.value })
      utils.record.list.refetch({ tableId: table.id.value })
    },
  })

  return (
    <Popover position="bottom-start" opened={opened} onChange={handler.toggle} closeOnClickOutside>
      <Popover.Target>
        <Button
          size="xs"
          variant={filters.length ? 'light' : 'outline'}
          loading={setFilter.isLoading}
          leftIcon={<IconFilter size={18} />}
          onClick={handler.toggle}
          rightIcon={filters.length ? <Badge>{filters.length}</Badge> : null}
        >
          Filter
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <FiltersEditor
          table={table}
          onApply={(filter) => {
            setFilter.mutate({ tableId: table.id.value, filter })
          }}
          onCancel={handler.close}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
