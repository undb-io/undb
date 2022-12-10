import type { IFilter, IRecordOperator, Table } from '@egodb/core'
import { Box, Button, Divider, Group, IconPlus, Stack, useListState } from '@egodb/ui'
import { FieldFilter } from './field-filter'
import useDeepCompareEffect from 'use-deep-compare-effect'

interface IProps {
  table: Table
  onChange?: (filters: IRecordOperator[]) => void
  onApply?: (filters: IRecordOperator[]) => void
  onCancel?: () => void
}

export const FiltersEditor: React.FC<IProps> = ({ table, onChange, onApply, onCancel }) => {
  const initialFilters = table.getOrCreateDefaultView().filters?.value
  const recordFilters = initialFilters ? Object.values(initialFilters) : undefined
  const [filters, handlers] = useListState<IFilter | null>(recordFilters ?? [null])
  const validFilters = filters.filter((f) => f !== null) as IRecordOperator[]

  useDeepCompareEffect(() => {
    onChange?.(validFilters)
  }, [validFilters])

  return (
    <Box miw={640}>
      <Stack>
        {filters.map((filter, index) => (
          <FieldFilter
            key={index}
            schema={table.schema}
            index={index}
            value={filter}
            onChange={(operator, index) => handlers.setItem(index, operator)}
          />
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
