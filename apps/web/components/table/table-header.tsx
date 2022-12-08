import { Group, Text, Title } from '@egodb/ui'
import type { ITableBaseProps } from './table-base-props'

export const TableHaeder: React.FC<ITableBaseProps> = ({ table }) => {
  return (
    <Group fz="md" py="md">
      <Text fw={500} color="gray.5">
        Tables
      </Text>
      <Text color="gray.4">/</Text>
      <Title order={3}>{table.name.value}</Title>
    </Group>
  )
}
