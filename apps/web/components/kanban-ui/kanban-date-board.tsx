import { DragOverlay } from '@dnd-kit/core'
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { DateField, Records } from '@egodb/core'
import { Container, Group } from '@egodb/ui'
import { useEffect, useState } from 'react'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanLane } from './kanban-lane'
import { groupBy } from '@fxts/core'
import { KanbanCard } from './kanban-card'
import { NODATE_STACK_ID } from './kanban.constants'
import { useKanban } from './use-kanban'
import type { Record as CoreRecord } from '@egodb/core'
import { KANBAN_DATE_STACKS, RElAVANT_DATES } from './kanban-date.utils'
import { addDays, isAfter, isBefore, isToday, isTomorrow, isYesterday, startOfDay } from 'date-fns'
import { endOfDay } from 'date-fns/esm'

interface IProps extends ITableBaseProps {
  field: DateField
  records: Records
}

export const KanbanDateBoard: React.FC<IProps> = ({ table, field, records }) => {
  const containers = KANBAN_DATE_STACKS

  const groupDateRecords = (): Record<string, CoreRecord[]> =>
    groupBy(
      (record) =>
        record.values.getDateValue(field.id.value).mapOr<string>(NODATE_STACK_ID, (v) => {
          if (!v) return 'NO_DATE'
          if (isToday(v)) return 'TODAY'
          if (isTomorrow(v)) return 'TOMORROW'
          if (isYesterday(v)) return 'YESTERDAY'
          if (isAfter(v, endOfDay(addDays(v, 1)))) return 'AFTER_TOMORROW'
          if (isBefore(v, startOfDay(addDays(v, -1)))) return 'AFTER_TOMORROW'
          return 'NO_DATE'
        }) ?? NODATE_STACK_ID,
      records,
    )
  const [dateRecords, setDateRecords] = useState(groupDateRecords())

  useEffect(() => {
    setDateRecords(groupDateRecords())
  }, [records])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const utils = trpc.useContext()
  const updateRecord = trpc.record.update.useMutation({
    onSuccess() {
      utils.record.list.refetch()
    },
  })

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

    onDragItemEnd: (e, overContainer) => {
      updateRecord.mutate({
        tableId: table.id.value,
        id: e.active.id as string,
        value: [{ id: field.id.value, value: overContainer === NODATE_STACK_ID ? null : overContainer }],
      })
    },

    getContainer: (activeId) => containers.find((stack) => stack === activeId),
  })

  return (
    <Container fluid ml={0}>
      <Group align="start" noWrap>
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
              table={table}
              records={dateRecords[stack] ?? []}
              key={stack}
              id={stack}
              title={stack}
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
                table={table}
                field={field}
                records={dateRecords[(activeId as string) || ''] ?? []}
                title={activeContainer ?? ''}
                id={activeContainer ?? ''}
              />
            ) : (
              <KanbanCard record={activeItem!} table={table} />
            )}
          </DragOverlay>
        </DndContext>
      </Group>
    </Container>
  )
}
