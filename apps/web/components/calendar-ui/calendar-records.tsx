import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { DateEqual, DateFieldValue, DateRangeEqual, DateRangeFieldValue } from '@egodb/core'
import type { Record, ICalendarField, Records } from '@egodb/core'
import { ActionIcon, Box, Group, IconGripVertical, Space, Stack, Text, Title } from '@egodb/ui'
import { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

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
  const spec =
    field.type === 'date'
      ? new DateEqual(field.id.value, new DateFieldValue(null))
      : new DateRangeEqual(field.id.value, new DateRangeFieldValue(null))

  const nullRecords = useMemo(() => records.filter((r) => spec.isSatisfiedBy(r)), [records])

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: nullRecords.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    overscan: 5,
  })
  const paddingTop = rowVirtualizer.getVirtualItems().length > 0 ? rowVirtualizer.getVirtualItems()?.[0]?.start || 0 : 0
  const paddingBottom =
    rowVirtualizer.getVirtualItems().length > 0
      ? rowVirtualizer.getTotalSize() -
        (rowVirtualizer.getVirtualItems()?.[rowVirtualizer.getVirtualItems().length - 1]?.end || 0)
      : 0

  return (
    <Box p="md" bg="white" h="100%">
      <Title size={20}>Records</Title>
      <Space h="md" />
      {nullRecords.length ? (
        <Stack ref={tableContainerRef} h="100%" sx={{ overflow: 'auto' }}>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}

          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const record = nullRecords[virtualRow.index]
            return <DraggableRecord key={record.id.value} record={record} />
          })}

          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
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
