import { Group, Text, Title } from '@egodb/ui'
import { EditTableFormDrawer } from '../edit-table-form/edit-table-form-drawer'
import { EditTableButton } from './edit-table-button'
import type { ITableBaseProps } from './table-base-props'

export const TableHaeder: React.FC<ITableBaseProps> = ({ table }) => {
  return (
    <Group fz="md" px="md" py="xs">
      <Text fw={500} color="gray.5">
        Tables
      </Text>
      <Text color="gray.4">/</Text>
      <Title order={3}>{table.name.value}</Title>

      <EditTableButton />
      <EditTableFormDrawer table={table} />
    </Group>
  )
}
