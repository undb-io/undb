import type { NonNullableGetTableOutput } from '@egodb/core'
import { Button, Group, Text, IconPlus, Title } from '@egodb/ui'
import { useAtom } from 'jotai'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'

interface IProps {
  table: NonNullableGetTableOutput
}

export const TableHaeder: React.FC<IProps> = ({ table }) => {
  const [, setOpened] = useAtom(createRecordFormDrawerOpened)
  return (
    <Group position="apart" px="md" py="xl">
      <Group fz="md">
        <Text fw={500} color="gray.5">
          Tables
        </Text>
        <Text color="gray.4">/</Text>
        <Title order={3}>{table.name}</Title>
      </Group>
      <Button leftIcon={<IconPlus size={14} />} onClick={() => setOpened(true)}>
        Add New Record
      </Button>
    </Group>
  )
}
