import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { ICalendarField, Records } from '@egodb/core'
import type { Record } from '@egodb/core'
import { NullSpecification } from '@egodb/core'
import { ActionIcon, Box, Group, IconGripVertical, Space, Stack, Text, Title } from '@egodb/ui'
import { useMemo } from 'react'

interface IProps {
  field: ICalendarField
  records: Records
}

const DraggableRecord: React.FC<{ record: Record }> = ({ record }) => {
  const { setNodeRef, attributes, listeners, setActivatorNodeRef, transform, isDragging } = useDraggable({
    id: record.id.value,
  })

  return (
    <Box
      ref={setNodeRef}
      w="100%"
      p="sm"
      sx={(theme) => ({
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : undefined,
        opacity: isDragging ? 0.7 : undefined,
        backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
        borderRadius: theme.radius.sm,
        boxShadow: theme.shadows.lg,
      })}
    >
      <Group>
        <ActionIcon
          size={18}
          variant="transparent"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          sx={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <IconGripVertical color="white" />
        </ActionIcon>
        <Text color="white">{record.id.value}</Text>
      </Group>
    </Box>
  )
}

export const CalendarRecords: React.FC<IProps> = ({ field, records }) => {
  const spec = new NullSpecification(field.id.value)
  const nullRecords = useMemo(() => records.filter((r) => spec.isSatisfiedBy(r)), [records])
  return (
    <Box p="md" bg="white" h="100%">
      <Title size={20}>Records</Title>
      <Space h="md" />
      {nullRecords.length ? (
        <Stack>
          {nullRecords.map((record) => (
            <DraggableRecord key={record.id.value} record={record} />
          ))}
        </Stack>
      ) : (
        <Box
          p="md"
          sx={(theme) => ({
            fontSize: theme.fontSizes.sm,
            borderRadius: theme.radius.sm,
            backgroundColor: theme.colors.gray[0],
          })}
          color="gray"
        >
          There are no more unscheduled records.
        </Box>
      )}
    </Box>
  )
}
