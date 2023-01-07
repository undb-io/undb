import type { ICalendarField, Records } from '@egodb/core'
import { DateEqual } from '@egodb/core'
import { Box, Indicator, Space, Stack, Text } from '@egodb/ui'
import { useMemo } from 'react'

const today = new Date()

interface IProps {
  records: Records
  field: ICalendarField
  date: Date
}

export const Day: React.FC<IProps> = ({ date, field, records }) => {
  const filteredRecords = useMemo(() => {
    const spec = new DateEqual(field.id.value, date)
    return records.filter((r) => spec.isSatisfiedBy(r))
  }, [records])

  return (
    <Stack
      spacing="xs"
      w="100%"
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
        <Box sx={{ textAlign: 'start' }}>{date.getDate()}</Box>
        <Space h={3} />
        <Stack spacing={5}>
          {filteredRecords.map((r) => (
            <Box
              key={r.id.value}
              bg="white"
              px="xs"
              w="100%"
              sx={(theme) => ({
                textAlign: 'start',
                borderRadius: theme.radius.xs,
                border: `1px ${theme.colors.gray[2]} solid`,
                boxShadow: theme.shadows.xs,
                lineHeight: theme.fontSizes.sm + 'px',
              })}
            >
              <Text color="dark">{r.id.value}</Text>
            </Box>
          ))}
        </Stack>
      </Indicator>
    </Stack>
  )
}
