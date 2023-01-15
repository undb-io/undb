import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ActionIcon, Group, IconGripVertical, IconRowInsertTop, Stack, Text } from '@egodb/ui'
import { CSS } from '@dnd-kit/utilities'
import type { ICreateFieldValue, IKanbanField, Records } from '@egodb/core'
import { SortableKanbanCard } from './kanban-card'
import type { Table } from '@egodb/core'
import { useSetAtom } from 'jotai'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import type { SortableProps } from '../sortable.interface'
import { UNCATEGORIZED_OPTION_ID } from './kanban.constants'
import type { ReactNode } from 'react'
import { KanbanLaneMenu } from './kanban-lane-menu'
import React from 'react'

interface IProps {
  renderMenu?: () => ReactNode
  id: string | null
  title: ReactNode
  table: Table
  field: IKanbanField
  records: Records
  disableAddRecord?: boolean
  getRecordValue?: (id: string | null) => ICreateFieldValue
}

type IKanbanLaneProps = IProps & SortableProps

export const KanbanLane: React.FC<IKanbanLaneProps> = ({
  id,
  field,
  table,
  setNodeRef,
  setActivatorNodeRef,
  style,
  title,
  attributes = {},
  listeners,
  records,
  disableAddRecord,
  renderMenu,
  getRecordValue,
}) => {
  const setOpened = useSetAtom(createRecordFormDrawerOpened)
  const setCreateRecordInitialValue = useSetAtom(createRecordInitialValueAtom)

  const onCreateRecord = () => {
    setOpened(true)
    if (id && getRecordValue) {
      setCreateRecordInitialValue({ [field.id.value]: getRecordValue(id) })
    }
  }

  const items = records.map((r) => r.id.value)

  return (
    <Stack w={350} ref={setNodeRef} style={style} h="100%" sx={{ flexShrink: 0 }}>
      <Group position="apart" h={40}>
        <Group spacing="xs">
          {listeners ? (
            <ActionIcon ref={setActivatorNodeRef} {...listeners} {...attributes}>
              <IconGripVertical size={14} cursor="grab" />
            </ActionIcon>
          ) : null}
          {React.isValidElement(title) ? title : <Text weight={500}>{title}</Text>}
        </Group>

        {id && (
          <KanbanLaneMenu table={table} field={field} optionKey={id}>
            {renderMenu?.()}
          </KanbanLaneMenu>
        )}
      </Group>

      <Stack>
        {!disableAddRecord ? (
          <ActionIcon w="100%" color="gray" variant="light" onClick={onCreateRecord}>
            <IconRowInsertTop />
          </ActionIcon>
        ) : null}

        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {records.map((r) => (
            <SortableKanbanCard table={table} record={r} key={r.id.value} />
          ))}
        </SortableContext>
      </Stack>
    </Stack>
  )
}

export const SortableKanbanLane: React.FC<IProps> = (props) => {
  const { attributes, listeners, isDragging, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
    id: props.id as string,
    disabled: props.id === UNCATEGORIZED_OPTION_ID,
    data: {
      type: 'container',
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 100 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <KanbanLane
      {...props}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      setActivatorNodeRef={setActivatorNodeRef}
      style={style}
    />
  )
}
