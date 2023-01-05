import type { DropAnimation } from '@dnd-kit/core'
import { defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { DragOverlay } from '@dnd-kit/core'
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Records, SelectField } from '@egodb/core'
import { Container, Group, Modal, useListState } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { openKanbanEditFieldAtom } from './kanban-edit-field.atom'
import { KanbanLane, SortableKanbanLane } from './kanban-lane'
import { CreateNewOptionButton } from './create-new-option-button'
import { SelectKanbanField } from './select-kanban-field'
import { CreateNewOptionModal } from './create-new-option-modal'
import { groupBy } from '@fxts/core'
import { KanbanCard } from './kanban-card'
import { UNCATEGORIZED_OPTION_ID } from './kanban.constants'
import { useKanban } from './use-kanban'
import type { Record } from '@egodb/core'
import type { Option } from '@egodb/core'

interface IProps extends ITableBaseProps {
  field: SelectField
  records: Records
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

export const SelectBoard: React.FC<IProps> = ({ table, field, records }) => {
  const [options, handlers] = useListState(field.options.options)
  const containers = options.map((o) => o.id.value)

  const [opened, setOpened] = useAtom(openKanbanEditFieldAtom)

  const groupOptionRecords = () =>
    groupBy(
      (record) =>
        record.values.getSelectValue(field.name.value).mapOr(UNCATEGORIZED_OPTION_ID, (v) => v.id) ??
        UNCATEGORIZED_OPTION_ID,
      records,
    )
  const [optionRecords, setOptionRecords] = useState(groupOptionRecords())

  const reorderOptions = trpc.table.field.select.reorderOptions.useMutation()

  useEffect(() => {
    handlers.setState(field.options.options)
  }, [field])

  useEffect(() => {
    setOptionRecords(groupOptionRecords())
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

  const { collisionDetectionStrategy, onDragStart, onDragOver, onDragEnd, isActiveContainer, activeId, activeItem } =
    useKanban<Option, Record>({
      containers,
      items: optionRecords,
      setItems: setOptionRecords,
      getItemId: (item) => item.id.value,
      getActiveItem: (activeId) => records.find((r) => r.id.value === activeId),

      onDragContainerEnd: ({ active, over }) => {
        if (over) {
          handlers.reorder({
            from: active.data.current?.sortable?.index,
            to: over.data.current?.sortable?.index,
          })

          reorderOptions.mutate({
            tableId: table.id.value,
            fieldId: field.id.value,
            from: active.id as string,
            to: over.id as string,
          })
        }
      },
      onDragItemEnd: (e, overContainer) => {
        updateRecord.mutate({
          tableId: table.id.value,
          id: e.active.id as string,
          value: [{ name: field.name.value, value: overContainer === UNCATEGORIZED_OPTION_ID ? null : overContainer }],
        })
      },
    })
  const activeContainer = options.find((o) => o.id.value === activeId)

  return (
    <Container fluid ml={0}>
      {opened && (
        <Modal
          target="body"
          withCloseButton={false}
          opened={opened}
          onClose={() => setOpened(false)}
          styles={{ modal: { padding: '0 !important' } }}
        >
          <SelectKanbanField table={table} onSuccess={() => setOpened(false)} />
        </Modal>
      )}

      <Group align="start" noWrap>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          collisionDetection={collisionDetectionStrategy}
        >
          <KanbanLane
            table={table}
            field={field}
            records={optionRecords[UNCATEGORIZED_OPTION_ID] ?? []}
            title="uncategorized"
            id={UNCATEGORIZED_OPTION_ID}
          />
          <SortableContext items={containers} strategy={horizontalListSortingStrategy}>
            {options.map((option) => (
              <SortableKanbanLane
                field={field}
                table={table}
                records={optionRecords[option.id.value] ?? []}
                key={option.id.value}
                id={option.id.value}
                title={option.name.value}
              />
            ))}

            <DragOverlay dropAnimation={dropAnimation}>
              {isActiveContainer ? (
                <KanbanLane
                  table={table}
                  field={field}
                  records={optionRecords[(activeId as string) || ''] ?? []}
                  title={activeContainer?.name.value ?? ''}
                  id={activeContainer?.id.value ?? ''}
                />
              ) : (
                <KanbanCard record={activeItem!} table={table} />
              )}
            </DragOverlay>
          </SortableContext>
        </DndContext>

        <CreateNewOptionModal table={table} field={field} />
        <CreateNewOptionButton />
      </Group>
    </Container>
  )
}
