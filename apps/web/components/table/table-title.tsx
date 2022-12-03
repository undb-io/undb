import type { NonNullableGetTableOutput } from '@egodb/core'
import { Button, Group, IconPlus, Title } from '@egodb/ui'

interface IProps {
  table: NonNullableGetTableOutput
}

export const TableHaeder: React.FC<IProps> = ({ table }) => {
  return (
    <Group position="apart" p="md">
      <Title order={2}>{table.name}</Title>
      <Button color="dark" leftIcon={<IconPlus size={14} />}>
        Add New Record
      </Button>
    </Group>
  )
}
