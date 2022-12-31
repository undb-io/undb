import { ActionIcon, Card, Group, IconGripVertical, Text } from '@egodb/ui'

interface IProps {
  title: string
}

export const KanbanLane: React.FC<IProps> = ({ title }) => {
  return (
    <Card withBorder shadow="xs" radius="sm" w={350}>
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart">
          <Text weight={500}>{title}</Text>

          <ActionIcon>
            <IconGripVertical size={14} cursor="grab" />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Card.Section withBorder inheritPadding p="sm" bg="gray.1" mih={400}>
        item
      </Card.Section>
    </Card>
  )
}
