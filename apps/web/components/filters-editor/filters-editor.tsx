import type { IFilter, IRootFilterList, Table } from '@egodb/core'
import { ActionIcon, Box, Button, Divider, Group, IconPlus, IconTrash, Stack, useListState } from '@egodb/ui'
import { FieldFilter } from './field-filter'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useEffect } from 'react'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { getFilterId } from './get-filter.id'
interface IProps {
  table: Table
  onChange?: (filters: IRootFilterList) => void
  onApply?: (filters: IRootFilterList) => void
  onCancel?: () => void
}

export const FiltersEditor: React.FC<IProps> = ({ table, onChange, onApply, onCancel }) => {
  // TODO: ignore group for now
  const initialFilters = table.getOrCreateDefaultView().filterList as IFilter[]
  const [filters, handlers] = useListState<IFilter | null>(initialFilters.length ? initialFilters : [null])
  const validFilters = filters.filter((f) => f !== null) as IRootFilterList

  const hasNull = filters.some((f) => f === null)

  useDeepCompareEffect(() => {
    onChange?.(validFilters)
  }, [validFilters])

  useEffect(() => {
    if (filters.length === 0) {
      handlers.append(null)
    }
  }, [filters.length])
  const items = filters.map(getFilterId)

  return (
    <Box miw={640}>
      <Stack>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={(e) => {
            const { over, active } = e
            if (over) {
              handlers.reorder({
                from: active.data.current?.sortable?.index,
                to: over?.data.current?.sortable?.index,
              })
            }
          }}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {filters.map((filter, index) => (
              <FieldFilter
                schema={table.schema}
                index={index}
                value={filter}
                key={getFilterId(filter)}
                onChange={(operator, index) => handlers.setItem(index, operator)}
                onRemove={handlers.remove}
              />
            ))}
          </SortableContext>
        </DndContext>
        <Divider h="md" />
        <Group position="apart">
          <Button
            disabled={hasNull}
            variant="outline"
            size="xs"
            leftIcon={<IconPlus size={14} />}
            onClick={() => handlers.append(null)}
          >
            Add new filter
          </Button>
          <Group>
            <Button onClick={onCancel} variant="subtle" size="xs">
              Cancel
            </Button>
            <Button size="xs" onClick={() => onApply?.(validFilters)}>
              Apply
            </Button>
          </Group>
        </Group>
      </Stack>
    </Box>
  )
}
