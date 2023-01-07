import type { ICalendarField, Records } from '@egodb/core'
import { NullSpecification } from '@egodb/core'
import { ActionIcon, Box, Group, IconGripVertical, Space, Stack, Text, Title } from '@egodb/ui'
import { useMemo } from 'react'

interface IProps {
  field: ICalendarField
  records: Records
}

export const CalendarRecords: React.FC<IProps> = ({ field, records }) => {
  const spec = new NullSpecification(field.id.value)
  const nullRecords = useMemo(() => records.filter((r) => spec.isSatisfiedBy(r)), [records])
  return (
    <Box p="md">
      <Title size={20}>Records</Title>
      <Space h="md" />
      <Stack>
        {nullRecords.map((r) => (
          <Box
            key={r.id.value}
            w="100%"
            p="sm"
            sx={(theme) => ({
              backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
              borderRadius: theme.radius.sm,
              boxShadow: theme.shadows.lg,
            })}
          >
            <Group>
              <ActionIcon size={18} variant="transparent">
                <IconGripVertical color="white" />
              </ActionIcon>
              <Text color="white">{r.id.value}</Text>
            </Group>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
