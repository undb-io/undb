import { Group, Text, Title } from '@egodb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { EditTableFormDrawer } from '../edit-table-form/edit-table-form-drawer'
import { EditTableButton } from './edit-table-button'

export const TableHaeder: React.FC = () => {
  const table = useCurrentTable()
  return (
    <Group fz="md" px="md" py="xs">
      <Text fw={500} color="gray.5">
        Tables
      </Text>
      <Text color="gray.4">/</Text>
      <Title order={3}>{table.name.value}</Title>

      <EditTableButton />
      <EditTableFormDrawer />
    </Group>
  )
}
