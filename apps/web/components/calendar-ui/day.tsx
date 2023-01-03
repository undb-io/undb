import { Box, Group } from '@egodb/ui'

export const Day: React.FC<{ date: Date }> = ({ date }) => {
  return (
    <Group grow={false}>
      <Box component="span">{date.getDate()}</Box>
    </Group>
  )
}
