import { DragOverlay, PointerSensor } from '@dnd-kit/core'
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Records, SelectField } from '@egodb/core'
import {
  Badge,
  Box,
  Button,
  closeModal,
  Container,
  Group,
  IconPlus,
  Menu,
  openContextModal,
  useListState,
} from '@egodb/ui'
import { useEffect, useState } from 'react'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanLane, SortableKanbanLane } from './kanban-lane'
import { groupBy } from '@fxts/core'
import { KanbanCard } from './kanban-card'
import { UNCATEGORIZED_OPTION_ID } from './kanban.constants'
import { useKanban } from './use-kanban'
import type { Record, Option as CoreOption } from '@egodb/core'
import { Option } from '../option/option'
import type { IUpdateOptionModalProps } from '../update-option-form/update-option-modal'
import { CREATE_OPTION_MODAL_ID, UDPATE_OPTION_MODAL_ID } from '../../modals'

interface IProps extends ITableBaseProps {
  field: SelectField
  records: Records
}

export const KanbanSelectBoard: React.FC<IProps> = ({ table, field, records }) => {
  const [options, handlers] = useListState(field.options.options)
  const containers = [UNCATEGORIZED_OPTION_ID, ...options.map((o) => o.key.value)]
  const lastOption = options[options.length - 1]

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
          from: active.data.current?.sortable?.index - 1,
          to: over.data.current?.sortable?.index - 1,
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

    getContainer: (activeId) => options.find((o) => o.key.value === activeId),
  })

  return (
    <Container fluid ml={0} h="100%" sx={{ overflow: 'scroll' }}>
      <Group align="start" noWrap h="100%">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          collisionDetection={collisionDetectionStrategy}
        >
          <SortableContext items={containers} strategy={horizontalListSortingStrategy}>
            <SortableKanbanLane
              table={table}
              field={field}
              records={optionRecords[UNCATEGORIZED_OPTION_ID] ?? []}
              title={
                <Badge radius="xs" color="gray">
                  uncategorized
                </Badge>
              }
              id={UNCATEGORIZED_OPTION_ID}
              getRecordValue={(id) => (id === UNCATEGORIZED_OPTION_ID ? null : id)}
            />
            {options.map((option) => (
              <SortableKanbanLane
                field={field}
                table={table}
                records={optionRecords[option.key.value] ?? []}
                key={option.key.value}
                id={option.key.value}
                title={<Option name={option.name.value} colorName={option.color.name} shade={option.color.shade} />}
                renderMenu={() => (
                  <Menu.Item
                    onClick={() =>
                      openContextModal({
                        title: 'Update Option',
                        modal: UDPATE_OPTION_MODAL_ID,
                        innerProps: {
                          tableId: table.id.value,
                          field,
                          optionKey: option.key.value,
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
                  id={activeContainer?.key.value ?? ''}
                  title={
                    <Option
                      name={activeContainer!.name.value}
                      colorName={activeContainer!.color.name}
                      shade={activeContainer!.color.shade}
                    />
                  }
                />
              ) : (
                <KanbanCard record={activeItem!} table={table} />
              )}
            </DragOverlay>
          </SortableContext>
        </DndContext>

        <Box pr="md">
          <Button
            onClick={() =>
              openContextModal({
                title: 'Create New Option',
                modal: CREATE_OPTION_MODAL_ID,
                trapFocus: true,
                innerProps: {
                  table,
                  field,
                  color: lastOption?.color.next().unpack(),
                  onSuccess: () => closeModal(CREATE_OPTION_MODAL_ID),
                },
              })
            }
            w={300}
            variant="outline"
            leftIcon={<IconPlus />}
          >
            New Stack
          </Button>
        </Box>
      </Group>
    </Container>
  )
}
