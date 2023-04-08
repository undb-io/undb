import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Record, ICalendarField, Records } from '@undb/core'
import { DateFieldValue } from '@undb/core'
import { DateEqual } from '@undb/core'
import { setSelectedRecordId } from '@undb/store'
import { ActionIcon, Box, Group, IconGripVertical, IconPlus, Stack, useHover } from '@undb/ui'
import { isEqual, isToday } from 'date-fns'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { useAppDispatch } from '../../hooks'
import { useCloseAllDrawers } from '../../hooks/use-close-all-drawers'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import { RecordValues } from '../record/record-values'

interface IProps {
  records: Records
  field: ICalendarField
  date: Date
}

const DraggableRecord: React.FC<{ record: Record }> = ({ record }) => {
  const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
    id: record.id.value,
  })

  const dispatch = useAppDispatch()

  return (
    <Group
      ref={setNodeRef}
      bg="white"
      px={0}
      w="100%"
      spacing={0}
      role="button"
      noWrap
      sx={(theme) => ({
        color: theme.colors.dark,
        textAlign: 'start',
        borderRadius: theme.radius.xs,
        border: `1px ${theme.colors.gray[2]} solid`,
        boxShadow: theme.shadows.xs,
        lineHeight: theme.fontSizes.sm + 'px',
        cursor: 'pointer',
        overflow: 'hidden',
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
        zIndex: isDragging ? 1000 : undefined,
      })}
      onClick={(e) => {
        e.stopPropagation()
        dispatch(setSelectedRecordId(record.id.value))
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
      <RecordValues values={record.valuesJSON} />
    </Group>
  )
}

export const Day: React.FC<IProps> = ({ date, field, records }) => {
  const id = date.toISOString()
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  const filteredRecords = useMemo(() => {
    const spec = new DateEqual(field.id.value, new DateFieldValue(date))
    return records.filter((r) => spec.isSatisfiedBy(r))
  }, [records])

  const { hovered, ref } = useHover()

  const [opened, setCreateRecordOpened] = useAtom(createRecordFormDrawerOpened)
  const close = useCloseAllDrawers()
  const [initialValue, setRecordInitialValue] = useAtom(createRecordInitialValueAtom)

  return (
    <Box w="100%" h="100%" ref={ref}>
      <Stack
        ref={setNodeRef}
        spacing="sm"
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
              close()
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
