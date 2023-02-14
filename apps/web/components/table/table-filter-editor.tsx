import type { IFilter } from '@egodb/core'
import { useSetFilterMutation } from '@egodb/store'
import { Button, IconFilter, Popover, useDisclosure, Badge } from '@egodb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { FiltersEditor } from '../filters-editor/filters-editor'

export const TableFilterEditor: React.FC = () => {
  const table = useCurrentTable()
  const filters = table.mustGetView().filterList as IFilter[]
  const [opened, handler] = useDisclosure(false)

  const [setFilter, { isLoading }] = useSetFilterMutation()

  return (
    <Popover position="bottom-start" opened={opened} onChange={handler.toggle} closeOnClickOutside shadow="md">
      <Popover.Target>
        <Button
          compact
          size="xs"
          variant={filters.length ? 'light' : 'subtle'}
          loading={isLoading}
          leftIcon={<IconFilter size={18} />}
          onClick={handler.toggle}
          rightIcon={
            filters.length ? (
              <Badge variant="filled" size="xs">
                {filters.length}
              </Badge>
            ) : null
          }
        >
          Filter
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <FiltersEditor
          onApply={(filter) => {
            setFilter({ tableId: table.id.value, filter }).then(() => handler.close())
          }}
          onCancel={handler.close}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
