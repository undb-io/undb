import type { Table } from '@egodb/core'
import { Button, Divider, Group, IconArrowsSort, Popover, Stack, Text } from '@egodb/ui'

interface IProps {
  table: Table
}

export const TableSortEditor: React.FC<IProps> = ({ table }) => {
  const sorts = table.mustGetView().sorts?.unpack() ?? []
  const fields = table.schema.fields

  return (
    <Popover position="bottom-start" closeOnClickOutside shadow="md">
      <Popover.Target>
        <Button compact size="xs" variant="subtle" leftIcon={<IconArrowsSort size={16} />}>
          Sort
        </Button>
      </Popover.Target>

      <Popover.Dropdown miw={300}>
        <Text size="xs">Sort by</Text>
        <Divider my="xs" />
        {sorts.map((sort) => {
          return <Group key={sort.fieldId}></Group>
        })}
      </Popover.Dropdown>
    </Popover>
  )
}
