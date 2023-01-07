import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { ICalendarField, Records } from '@egodb/core'
import type { Record } from '@egodb/core'
import { DateEqual } from '@egodb/core'
import { ActionIcon, Box, Group, IconPlus, Indicator, Stack, Text, useHover } from '@egodb/ui'
import { isEqual, isToday } from 'date-fns'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'

interface IProps {
  records: Records
  field: ICalendarField
  date: Date
}

const DraggableRecord: React.FC<{ record: Record }> = ({ record }) => {
  const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
    id: record.id.value,
  })

  return (
    <Box
      ref={setNodeRef}
      bg="white"
      px="xs"
      w="100%"
      onClick={(e) => e.stopPropagation()}
      sx={(theme) => ({
        textAlign: 'start',
        borderRadius: theme.radius.xs,
        border: `1px ${theme.colors.gray[2]} solid`,
        boxShadow: theme.shadows.xs,
        lineHeight: theme.fontSizes.sm + 'px',
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : undefined,
      })}
      {...attributes}
      {...listeners}
    >
      <Text color="dark">{record.id.value}</Text>
    </Box>
  )
}

export const Day: React.FC<IProps> = ({ date, field, records }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
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
