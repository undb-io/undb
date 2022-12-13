import type { IFilter, IRootFilterList, Table } from '@egodb/core'
import { ActionIcon, Box, Button, Divider, Group, IconPlus, IconTrash, Stack, useListState } from '@egodb/ui'
import { FieldFilter } from './field-filter'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useEffect } from 'react'

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

  useDeepCompareEffect(() => {
    onChange?.(validFilters)
  }, [validFilters])

  useEffect(() => {
    if (filters.length === 0) {
      handlers.append(null)
    }
  }, [filters.length])

  return (
    <Box miw={640}>
      <Stack>
        {filters.map((filter, index) => (
          <Group key={index} align="center">
            <FieldFilter
              schema={table.schema}
              index={index}
              value={filter}
              onChange={(operator, index) => handlers.setItem(index, operator)}
            />
            <ActionIcon size="lg" color="gray.5" variant="outline" onClick={() => handlers.remove(index)}>
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        ))}
        <Divider h="md" />
        <Group position="apart">
          <Button variant="outline" size="xs" leftIcon={<IconPlus size={14} />} onClick={() => handlers.append(null)}>
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
