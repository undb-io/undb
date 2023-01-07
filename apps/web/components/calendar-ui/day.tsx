import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { ICalendarField, Records } from '@egodb/core'
import type { Record } from '@egodb/core'
import { DateEqual } from '@egodb/core'
import { ActionIcon, Box, Group, IconGripVertical, IconPlus, Stack, Text, useHover } from '@egodb/ui'
import { isEqual, isToday } from 'date-fns'
import { useAtom, useSetAtom } from 'jotai'
import { useMemo } from 'react'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import { editRecordFormDrawerOpened } from '../edit-record-form/drawer-opened.atom'
import { editRecordValuesAtom } from '../edit-record-form/edit-record-values.atom'

interface IProps {
  records: Records
  field: ICalendarField
  date: Date
}

const DraggableRecord: React.FC<{ record: Record }> = ({ record }) => {
  const setOpened = useSetAtom(editRecordFormDrawerOpened)
  const setRecordValues = useSetAtom(editRecordValuesAtom)
  const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
    id: record.id.value,
  })

  return (
    <Group
      ref={setNodeRef}
      bg="white"
      px="xs"
      w="100%"
      spacing="xs"
      role="button"
      sx={(theme) => ({
        textAlign: 'start',
        borderRadius: theme.radius.xs,
        border: `1px ${theme.colors.gray[2]} solid`,
        boxShadow: theme.shadows.xs,
        lineHeight: theme.fontSizes.sm + 'px',
        cursor: 'pointer',
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : undefined,
      })}
      onClick={(e) => {
        e.stopPropagation()
        setRecordValues({ id: record.id.value, values: record.values.valueJSON })
        setOpened(true)
      }}
    >
      <IconGripVertical
        {...attributes}
        {...listeners}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        size={12}
      />
      <Text color="dark">{record.id.value}</Text>
    </Group>
  )
}

export const Day: React.FC<IProps> = ({ date, field, records }) => {
  const id = date.toISOString()
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  const filteredRecords = useMemo(() => {
    const spec = new DateEqual(field.id.value, date)
    return records.filter((r) => spec.isSatisfiedBy(r))
  }, [records])

  const { hovered, ref } = useHover()

  const [opened, setCreateRecordOpened] = useAtom(createRecordFormDrawerOpened)
  const [initialValue, setRecordInitialValue] = useAtom(createRecordInitialValueAtom)

  return (
    <Box w="100%" h="100%" ref={ref}>
      <Stack
        ref={setNodeRef}
        spacing="xs"
        px={5}
        py="xs"
        w="100%"
        h="100%"
        sx={(theme) => ({
          lineHeight: theme.fontSizes.md + 'px',
          backgroundColor: isOver ? theme.colors.gray[0] : 'inherit',
        })}
      >
        <Group position="apart" ref={ref}>
          <Box
            px={2}
            py={1}
            sx={(theme) => ({
              borderRadius: theme.radius.xs,
              backgroundColor: isToday(date) ? theme.colors[theme.primaryColor][theme.fn.primaryShade()] : 'inherit',
              color: isToday(date) ? theme.white : 'inherit',
            })}
          >
            {date.getDate()}
          </Box>

          <ActionIcon
            onClick={() => {
              setCreateRecordOpened(true)
              setRecordInitialValue({ [field.id.value]: date })
            }}
            size={16}
            sx={{
              visibility:
                hovered ||
                (opened && initialValue[field.id.value] && isEqual(initialValue[field.id.value] as Date, date))
                  ? 'visible'
                  : 'hidden',
            }}
          >
            <IconPlus />
          </ActionIcon>
        </Group>
        <Stack spacing={5}>
          {isOver ? (
            <Box
              bg="white"
              px="xs"
              w="100%"
              h={20}
              sx={(theme) => ({
                textAlign: 'start',
                borderRadius: theme.radius.xs,
                border: `1px ${theme.colors.gray[5]} dashed`,
              })}
            />
          ) : null}
          {filteredRecords.map((record) => (
            <DraggableRecord record={record} key={record.id.value} />
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
