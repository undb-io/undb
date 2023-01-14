import { DragOverlay, PointerSensor } from '@dnd-kit/core'
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Records, SelectField } from '@egodb/core'
import { Container, Group, Menu, openContextModal, openModal, useListState } from '@egodb/ui'
import { useEffect, useState } from 'react'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanLane, SortableKanbanLane } from './kanban-lane'
import { CreateNewOptionButton } from './create-new-option-button'
import { CreateNewOptionModal } from './create-new-option-modal'
import { groupBy } from '@fxts/core'
import { KanbanCard } from './kanban-card'
import { UNCATEGORIZED_OPTION_ID } from './kanban.constants'
import { useKanban } from './use-kanban'
import type { Record, Option as CoreOption } from '@egodb/core'
import { Option } from '../option/option'
import type { IUpdateOptionModalProps } from '../update-option-form/update-option-modal'
import { UDPATE_OPTION_MODAL_ID } from '../update-option-form/update-option-modal'

interface IProps extends ITableBaseProps {
  field: SelectField
  records: Records
}

export const KanbanSelectBoard: React.FC<IProps> = ({ table, field, records }) => {
  const [options, handlers] = useListState(field.options.options)
  const containers = options.map((o) => o.id.value)

  const groupOptionRecords = () =>
    groupBy(
      (record) =>
        record.values.getSelectValue(field.id.value).mapOr(UNCATEGORIZED_OPTION_ID, (v) => v.id) ??
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
  } = useKanban<CoreOption, Record>({
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
    onDragItemEnd: (e, activeContainer, overContainer) => {
      updateRecord.mutate({
        tableId: table.id.value,
        id: e.active.id as string,
        value: [{ id: field.id.value, value: overContainer === UNCATEGORIZED_OPTION_ID ? null : overContainer }],
      })
    },

    getContainer: (activeId) => options.find((o) => o.id.value === activeId),
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
          <KanbanLane
            table={table}
            field={field}
            records={optionRecords[UNCATEGORIZED_OPTION_ID] ?? []}
            title="uncategorized"
            id={UNCATEGORIZED_OPTION_ID}
            getRecordValue={(id) => (id === UNCATEGORIZED_OPTION_ID ? null : id)}
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
                renderTitle={() => (
                  <Option name={option.name.value} colorName={option.color.name} shade={option.color.shade} />
                )}
                renderMenu={() => (
                  <Menu.Item
                    onClick={() =>
                      openContextModal({
                        title: 'Update Option',
                        modal: UDPATE_OPTION_MODAL_ID,
                        innerProps: {
                          tableId: table.id.value,
                          field,
                          optionId: option.id.value,
                          option: { name: option.name.value, color: option.color.unpack() },
                        } as IUpdateOptionModalProps,
                      })
                    }
                  >
                    Update Option
                  </Menu.Item>
                )}
                getRecordValue={(id) => (id === UNCATEGORIZED_OPTION_ID ? null : id)}
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
                  renderTitle={() => (
                    <Option
                      name={activeContainer!.name.value}
                      colorName={activeContainer!.color.name}
                      shade={activeContainer!.color.shade}
                    />
                  )}
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
