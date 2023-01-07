import { Box, Indicator, Stack } from '@egodb/ui'

const today = new Date()

export const Day: React.FC<{ date: Date }> = ({ date }) => {
  return (
    <Stack
      spacing="xs"
      sx={(theme) => ({
        lineHeight: theme.fontSizes.md + 'px',
      })}
    >
      <Indicator
        dot
        inline
        position="top-end"
        size={6}
        color="red"
        offset={-2}
        disabled={date.getDate() !== today.getDate()}
      >
        <Box>{date.getDate()}</Box>
      </Indicator>
    </Stack>
  )
}
