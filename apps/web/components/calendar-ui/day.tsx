import { useDroppable } from '@dnd-kit/core'
import type { ICalendarField, Records } from '@egodb/core'
import { DateEqual } from '@egodb/core'
import { Box, Indicator, Stack, Text } from '@egodb/ui'
import { isToday } from 'date-fns'
import { useMemo } from 'react'

interface IProps {
  records: Records
  field: ICalendarField
  date: Date
}

export const Day: React.FC<IProps> = ({ date, field, records }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
  })

  const filteredRecords = useMemo(() => {
    const spec = new DateEqual(field.id.value, date)
    return records.filter((r) => spec.isSatisfiedBy(r))
  }, [records])

  return (
    <Stack
      ref={setNodeRef}
      spacing="xs"
      px="sm"
      py="xs"
      w="100%"
      h="100%"
      sx={(theme) => ({
        lineHeight: theme.fontSizes.md + 'px',
      })}
    >
      <Box maw={10} sx={{ textAlign: 'start' }}>
        <Indicator position="top-end" offset={-2} size={6} color="red" disabled={!isToday(date)}>
          <span>{date.getDate()}</span>
        </Indicator>
      </Box>
      <Stack spacing={5}>
        {isOver ? (
          <Box
            bg="white"
            px="xs"
            w="100%"
            h={20}
            sx={(theme) => ({
              textAlign: 'start',
              borderRadius: theme.radius.xs,
              border: `1px ${theme.colors.gray[5]} dashed`,
            })}
          />
        ) : null}
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
    </Stack>
  )
}
