import type { NonNullableGetTableOutput } from '@egodb/core'
import { Button, Group, Text, IconPlus, Title } from '@egodb/ui'

interface IProps {
  table: NonNullableGetTableOutput
}

export const TableHaeder: React.FC<IProps> = ({ table }) => {
  return (
    <Group position="apart" px="md" py="xl">
      <Group fz="md">
        <Text fw={500} color="gray.5">
          Tables
        </Text>
        <Text color="gray.4">/</Text>
        <Title order={3}>{table.name}</Title>
      </Group>
      <Button leftIcon={<IconPlus size={14} />}>Add New Record</Button>
    </Group>
  )
}
