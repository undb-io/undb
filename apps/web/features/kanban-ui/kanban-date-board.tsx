import { DragOverlay, PointerSensor } from '@dnd-kit/core'
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { RecordFactory } from '@egodb/core'
import { Container, Group } from '@egodb/ui'
import { useEffect, useState } from 'react'
import { KanbanLane } from './kanban-lane'
import { KanbanCard } from './kanban-card'
import { NODATE_STACK_ID } from './kanban.constants'
import { useKanban } from './use-kanban'
import type { Record as CoreRecord, DateField, IQueryRecords } from '@egodb/core'
import { KANBAN_DATE_STACKS, RElAVANT_DATES } from './kanban-date.utils'
import { addDays, isAfter, isBefore, isToday, isTomorrow, isYesterday, startOfDay } from 'date-fns'
import { endOfDay } from 'date-fns/esm'
import type { DateFieldValue } from '@egodb/core'
import { useGetRecordsQuery, useUpdateRecordMutation } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { groupBy } from 'lodash-es'
import { useTranslation } from 'react-i18next'

interface IProps {
  field: DateField
}

export const KanbanDateBoard: React.FC<IProps> = ({ field }) => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const containers = KANBAN_DATE_STACKS

  const { groupdRecords, records, isLoading } = useGetRecordsQuery(
    {
      tableId: table.id.value,
      viewId: view.id.value,
    },
    {
      selectFromResult: (result) => {
        const rawRecords = (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryRecords
        const records = RecordFactory.fromQueryRecords(rawRecords, table.schema.toIdMap())
        const groupdRecords = groupBy(records, (record) => {
          const value = (record.values.value.get(field.id.value) as DateFieldValue | undefined)?.unpack()
          if (!value) return 'NO_DATE'
          if (isToday(value)) return 'TODAY'
          if (isTomorrow(value)) return 'TOMORROW'
          if (isYesterday(value)) return 'YESTERDAY'
          if (isAfter(value, endOfDay(addDays(value, 1)))) return 'AFTER_TOMORROW'
          if (isBefore(value, startOfDay(addDays(value, -1)))) return 'AFTER_TOMORROW'
          return 'NO_DATE'
        })
        return {
          ...result,
          records,
          groupdRecords,
        }
      },
    },
  )

  const [dateRecords, setDateRecords] = useState(groupdRecords)
  useEffect(() => {
    setDateRecords(groupdRecords)
  }, [isLoading])

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

  const {
    collisionDetectionStrategy,
    onDragStart,
    onDragOver,
    onDragEnd,
    isActiveContainer,
    activeId,
    activeItem,
    dropAnimation,
    activeContainer,
  } = useKanban<string, CoreRecord>({
    containers,
    items: dateRecords,
    setItems: setDateRecords,
    getItemId: (item) => item.id.value,
    getActiveItem: (activeId) => records.find((r) => r.id.value === activeId),

    onDragItemEnd: (e, activeContainer, overContainer) => {
      updateRecord({
        tableId: table.id.value,
        id: e.active.id as string,
        value: [{ id: field.id.value, value: overContainer === NODATE_STACK_ID ? null : overContainer }],
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
          {KANBAN_DATE_STACKS.map((stack) => (
            <KanbanLane
              field={field}
              records={dateRecords[stack] ?? []}
              key={stack}
              id={stack}
              title={t(stack, { ns: 'common' })}
              disableAddRecord={RElAVANT_DATES.includes(stack)}
              getRecordValue={(id) => {
                if (id === NODATE_STACK_ID) return null
                if (id === 'TODAY') return startOfDay(new Date())
                if (id === 'YESTERDAY') return startOfDay(addDays(new Date(), -1))
                if (id === 'TOMORROW') return startOfDay(addDays(new Date(), 1))
                return null
              }}
            />
          ))}

          <DragOverlay dropAnimation={dropAnimation}>
            {isActiveContainer ? (
              <KanbanLane
                field={field}
                records={dateRecords[(activeId as string) || ''] ?? []}
                title={activeContainer ?? ''}
                id={activeContainer ?? ''}
              />
            ) : (
              <KanbanCard record={activeItem!} />
            )}
          </DragOverlay>
        </DndContext>
      </Group>
    </Container>
  )
}
