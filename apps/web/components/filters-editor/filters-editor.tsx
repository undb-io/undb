import type { IRecordOperator, TableSchema } from '@egodb/core'
import { Box, Button, Divider, Group, IconPlus, Stack, useListState } from '@egodb/ui'
import { FieldFilter } from './field-filter'
import useDeepCompareEffect from 'use-deep-compare-effect'

interface IProps {
  schema: TableSchema
  onChange?: (filters: IRecordOperator[]) => void
  onApply?: (filters: IRecordOperator[]) => void
  onCancel?: () => void
}

export const FiltersEditor: React.FC<IProps> = ({ schema, onChange, onApply, onCancel }) => {
  const [filters, handlers] = useListState<IRecordOperator | null>([null])
  const validFilters = filters.filter((f) => f !== null) as IRecordOperator[]

  useDeepCompareEffect(() => {
    onChange?.(validFilters)
  }, [validFilters])

  return (
    <Box miw={640}>
      <Stack>
        {filters.map((_, index) => (
          <FieldFilter
            key={index}
            schema={schema}
            index={index}
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
