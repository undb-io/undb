import { Group, Square, Text } from '@undb/ui'

export const ColorValue: React.FC<{ value: string }> = ({ value }) => {
  return (
    <Group spacing="xs">
      <Square bg={value} w={16} sx={(theme) => ({ borderRadius: theme.radius.sm })} />
      <Text>{value}</Text>
    </Group>
  )
}
