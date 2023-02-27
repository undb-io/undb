import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { RecordFactory } from '@egodb/core'
import type { Record, ICalendarField } from '@egodb/core'
import { ActionIcon, Box, Group, IconGripVertical, Skeleton, Space, Stack, Text, Title } from '@egodb/ui'
import { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useGetRecordsQuery } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'

interface IProps {
  field: ICalendarField
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

export const CalendarRecords: React.FC<IProps> = ({ field }) => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const { rawRecords, isLoading } = useGetRecordsQuery(
    {
      tableId: table.id.value,
      viewId: view.id.value,
      filter: [{ path: field.id.value, type: 'date', value: null, operator: '$eq' }],
    },
    {
      selectFromResult: (result) => ({
        ...result,
        rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean),
      }),
    },
  )

  const records = useMemo(() => RecordFactory.fromQueryRecords(rawRecords, table.schema.toIdMap()), [rawRecords])

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: records.length,
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

  if (isLoading) {
    return (
      <Box p="md">
        <Title size={20}>Records</Title>
        <Space h="md" />
        <Stack>
          <Skeleton h={50} />
          <Skeleton h={50} />
          <Skeleton h={50} />
          <Skeleton h={50} />
          <Skeleton h={50} />
          <Skeleton h={50} />
          <Skeleton h={50} />
          <Skeleton h={50} />
          <Skeleton h={50} />
          <Skeleton h={50} />
        </Stack>
      </Box>
    )
  }

  return (
    <Box p="md" bg="white" h="100%">
      <Title size={20}>Records</Title>
      <Space h="md" />
      {records.length ? (
        <Stack ref={tableContainerRef} h="100%" sx={{ overflow: 'auto', overflowX: 'hidden' }}>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}

          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const record = records[virtualRow.index]
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
