import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ActionIcon, Card, Group, IconGripVertical, IconRowInsertTop, Stack, Text } from '@egodb/ui'
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

interface IProps {
  renderTitle?: () => ReactNode
  id: string | null
  title: string
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
  renderTitle,
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
    <Card ref={setNodeRef} withBorder shadow="xs" radius="sm" w={350} style={style}>
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart">
          {renderTitle ? renderTitle() : <Text weight={500}>{title}</Text>}

          {listeners ? (
            <ActionIcon ref={setActivatorNodeRef} {...listeners} {...attributes}>
              <IconGripVertical size={14} cursor="grab" />
            </ActionIcon>
          ) : null}
        </Group>
      </Card.Section>

      <Card.Section withBorder inheritPadding p="sm" bg="gray.0" mih={400}>
        <Stack>
          {!disableAddRecord ? (
            <ActionIcon w="100%" color="blue" variant="outline" onClick={onCreateRecord}>
              <IconRowInsertTop />
            </ActionIcon>
          ) : null}

          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {records.map((r) => (
              <SortableKanbanCard table={table} record={r} key={r.id.value} />
            ))}
          </SortableContext>
        </Stack>
      </Card.Section>
    </Card>
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
