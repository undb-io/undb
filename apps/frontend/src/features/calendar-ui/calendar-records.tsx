import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { RecordFactory } from '@undb/core'
import type { Record, ICalendarField } from '@undb/core'
import { ActionIcon, Box, Group, IconGripVertical, Skeleton, Space, Stack, Title } from '@undb/ui'
import { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { setSelectedRecordId } from '@undb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useTranslation } from 'react-i18next'
import { RecordValues } from '../record/record-values'
import { useAppDispatch } from '../../hooks'
import { useFetchRecords } from '../../hooks/use-fetch-records'

interface IProps {
  field: ICalendarField
}

const DraggableRecord: React.FC<{ record: Record }> = ({ record }) => {
  const { setNodeRef, attributes, listeners, setActivatorNodeRef, transform, isDragging } = useDraggable({
    id: record.id.value,
  })

  const dispatch = useAppDispatch()

  return (
    <Box
      ref={setNodeRef}
      w="100%"
      px="xs"
      py="sm"
      onClick={(e) => {
        e.stopPropagation()
        dispatch(setSelectedRecordId(record.id.value))
      }}
      sx={(theme) => ({
        cursor: 'pointer',
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : undefined,
        opacity: isDragging ? 0.7 : undefined,
        borderRadius: theme.radius.sm,
        border: '1px solid ' + theme.colors.gray[3],
        boxShadow: theme.shadows.lg,
        overflow: 'hidden',
      })}
    >
      <Group noWrap sx={{ overflow: 'hidden' }}>
        <ActionIcon
          size={18}
          variant="transparent"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          sx={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <IconGripVertical color="gray" />
        </ActionIcon>
        <RecordValues values={record.valuesJSON} />
      </Group>
    </Box>
  )
}

export const CalendarRecords: React.FC<IProps> = ({ field }) => {
  const table = useCurrentTable()
  const { rawRecords, isLoading, isFetching } = useFetchRecords([
    { path: field.id.value, type: 'date', value: null, operator: '$eq' },
  ])

  const records = useMemo(
    () => RecordFactory.fromQueryRecords(rawRecords, table.schema.toIdMap()),
    [rawRecords, isLoading, isFetching],
  )

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

  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Box p="md">
        <Title size={20}>{t('Unscheduled Records')}</Title>
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
      <Title size={20}>{t('Unscheduled Records')}</Title>
      <Space h="md" />
      {records.length ? (
        <Stack ref={tableContainerRef} h="100%">
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
          {t('No More Unscheduled Records')}
        </Box>
      )}
    </Box>
  )
}
