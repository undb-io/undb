import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, Group, Stack, useEgoUITheme } from '@egodb/ui'
import type { SortableProps } from '../sortable.interface'
import type { ITableBaseProps } from '../table/table-base-props'
import type { DateRangeFieldValue, Record, ReferenceFieldValue } from '@egodb/core'
import type { SelectFieldValue } from '@egodb/core'
import { Option } from '../option/option'
import type { CSSProperties } from 'react'
import type { DateFieldValue } from '@egodb/core'
import { format } from 'date-fns/fp'
import { FieldIcon } from '../fields/field-Icon'
import { useSetAtom } from 'jotai'
import { editRecordFormDrawerOpened } from '../edit-record-form/drawer-opened.atom'
import { editRecordValuesAtom } from '../edit-record-form/edit-record-values.atom'
import { ReferenceItem } from '../reference/reference-item'

interface IProps extends ITableBaseProps {
  record: Record
}

const dateFormat = format('yyyy-MM-dd')

export const KanbanCard: React.FC<IProps & SortableProps> = ({
  table,
  record,
  attributes,
  listeners,
  setNodeRef,
  style,
}) => {
  const setOpened = useSetAtom(editRecordFormDrawerOpened)
  const setValues = useSetAtom(editRecordValuesAtom)

  return (
    <Card
      py="sm"
      withBorder
      shadow="md"
      radius="xs"
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        setOpened(true)
        setValues({ id: record.id.value, values: record.values.valueJSON })
      }}
    >
      <Stack spacing={8} sx={(theme) => ({ fontSize: theme.fontSizes.sm })}>
        {Object.entries(record.values.valueJSON).map(([key, value]) => {
          const field = table.schema.getFieldById(key)
          if (field.isNone()) return null
          const f = field.unwrap()
          const icon = <FieldIcon type={f.type} color="gray" />
          if (f.type === 'select') {
            const option = (value as SelectFieldValue).getOption(f).into()
            if (!option) return null

            return (
              <Group spacing="xs" key={key}>
                {icon}
                <Option name={option.name.value} colorName={option.color.name} shade={option.color.shade} />
              </Group>
            )
          }
          if (f.type === 'date') {
            const date = (value as DateFieldValue)?.unpack()

            return (
              <Group spacing="xs" key={key}>
                {icon}
                {date && dateFormat(date)}
              </Group>
            )
          }
          if (f.type === 'date-range') {
            const date = (value as DateRangeFieldValue)?.unpack()
            return (
              <Group spacing="xs" key={key}>
                {icon}
                {date && `${dateFormat(date[0])} - ${dateFormat(date[1])}`}
              </Group>
            )
          }

          if (f.type === 'reference') {
            const records = (value as ReferenceFieldValue)?.unpack()

            if (records) {
              return (
                <Group spacing="xs" key={key}>
                  {icon}
                  <Group>
                    {records.map((value) => (
                      <ReferenceItem key={value} value={value} />
                    ))}
                  </Group>
                </Group>
              )
            } else {
              return (
                <Group spacing="xs" key={key}>
                  {icon}
                </Group>
              )
            }
          }

          return (
            <Group spacing="xs" key={key}>
              {icon}
              {value.unpack()?.toString()}
            </Group>
          )
        })}
      </Stack>
    </Card>
  )
}

export const SortableKanbanCard: React.FC<IProps> = ({ table, record }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
    id: record.id.value,
    data: {
      type: 'card',
    },
  })

  const theme = useEgoUITheme()

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.5 : undefined,
    boxShadow: isDragging ? theme.shadows.xl : theme.shadows.sm,
  }

  return (
    <KanbanCard
      table={table}
      record={record}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      style={style}
    />
  )
}
