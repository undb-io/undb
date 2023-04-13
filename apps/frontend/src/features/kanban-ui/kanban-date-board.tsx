import { DragOverlay, PointerSensor } from '@dnd-kit/core'
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { RecordFactory } from '@undb/core'
import { Container, Group } from '@undb/ui'
import { useEffect, useMemo, useState } from 'react'
import type { IProps as KanbanLaneProps } from './kanban-lane'
import { KanbanLane, SortableKanbanLane } from './kanban-lane'
import { KanbanCard } from './kanban-card'
import { useKanban } from './use-kanban'
import type { Record as CoreRecord, DateField } from '@undb/core'
import { getDateValue, KANBAN_DATE_STACKS, RElAVANT_DATES } from './kanban-date.utils'
import { addDays, isAfter, isBefore, isToday, isTomorrow, isYesterday, startOfDay } from 'date-fns'
import { endOfDay } from 'date-fns/esm'
import type { DateFieldValue } from '@undb/core'
import { useUpdateRecordMutation } from '@undb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { groupBy } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { useFetchRecords } from '../../hooks/use-fetch-records'

interface IProps {
  field: DateField
}

export const KanbanDateBoard: React.FC<IProps> = ({ field }) => {
  const table = useCurrentTable()
  const containers = KANBAN_DATE_STACKS as unknown as string[]

  const { rawRecords, isLoading, isFetching } = useFetchRecords()

  const records = useMemo(() => RecordFactory.fromQueryRecords(rawRecords, table.schema.toIdMap()), [rawRecords])
  const groupdRecords = useMemo(
    () =>
      groupBy(records, (record) => {
        const value = (record.values.value.get(field.id.value) as DateFieldValue | undefined)?.unpack()
        if (!value) return 'NO_DATE'
        if (isToday(value)) return 'TODAY'
        if (isTomorrow(value)) return 'TOMORROW'
        if (isYesterday(value)) return 'YESTERDAY'
        if (isAfter(value, endOfDay(addDays(new Date(), 1)))) return 'AFTER_TOMORROW'
        if (isBefore(value, startOfDay(addDays(new Date(), -1)))) return 'BEFORE_YESTERDAY'
        return 'NO_DATE'
      }),
    [records],
  )

  const [dateRecords, setDateRecords] = useState(groupdRecords)
  useEffect(() => {
    setDateRecords(groupdRecords)
  }, [isLoading, isFetching])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [updateRecord] = useUpdateRecordMutation()

  const { collisionDetectionStrategy, onDragStart, onDragOver, onDragEnd, activeItem, dropAnimation } = useKanban<
    string,
    CoreRecord
  >({
    containers,
    items: dateRecords,
    setItems: setDateRecords,
    getItemId: (item) => item.id.value,
    getActiveItem: (activeId) => records.find((r) => r.id.value === activeId),

    onDragItemEnd: (e, activeContainer, overContainer) => {
      updateRecord({
        tableId: table.id.value,
        id: e.active.id as string,
        values: { [field.id.value]: getDateValue(overContainer as any) },
      })
    },

    getContainer: (activeId) => containers.find((stack) => stack === activeId),
  })

  const { t } = useTranslation()

  return (
    <Container fluid ml={0} pt="xs" h="100%" sx={{ overflow: 'scroll' }}>
      <Group align="start" noWrap h="100%">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          collisionDetection={collisionDetectionStrategy}
        >
          <SortableContext items={containers} strategy={horizontalListSortingStrategy}>
            {KANBAN_DATE_STACKS.map((stack) => {
              const props: KanbanLaneProps = {
                field: field,
                records: dateRecords[stack] ?? [],
                id: stack,
                title: t(stack, { ns: 'common' }),
                disableAddRecord: RElAVANT_DATES.includes(stack as any),
                getRecordValue: (id) => (id ? getDateValue(id as any) : null),
              }
              return RElAVANT_DATES.includes(stack as any) ? (
                <KanbanLane key={stack} {...props} />
              ) : (
                <SortableKanbanLane key={stack} {...props} />
              )
            })}

            <DragOverlay dropAnimation={dropAnimation}>
              <KanbanCard record={activeItem!} />
            </DragOverlay>
          </SortableContext>
        </DndContext>
      </Group>
    </Container>
  )
}
