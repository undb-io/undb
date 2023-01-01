import { closestCenter, DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import type { ICreateOptionSchema } from '@egodb/core'
import { OptionId } from '@egodb/core'
import {
  useListState,
  Stack,
  Group,
  ActionIcon,
  IconGripVertical,
  TextInput,
  Button,
  IconSelect,
  FocusTrap,
} from '@egodb/ui'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { CSS } from '@dnd-kit/utilities'

interface ISelectFieldControlProps {
  onChange: (options: ICreateOptionSchema[]) => void
}

const OptionControl: React.FC<{ option: ICreateOptionSchema; onChange: (name: string) => void }> = ({
  option,
  onChange,
}) => {
  const { listeners, attributes, setNodeRef, transform, transition } = useSortable({ id: option.id as string })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Group spacing="xs" ref={setNodeRef} style={style}>
      <ActionIcon {...listeners} {...attributes}>
        <IconGripVertical size={14} color="gray" />
      </ActionIcon>
      <FocusTrap>
        <TextInput variant="unstyled" value={option.name} onChange={(e) => onChange(e.target.value)} />
      </FocusTrap>
    </Group>
  )
}

export const SelectFieldControl: React.FC<ISelectFieldControlProps> = ({ onChange }) => {
  const [options, handlers] = useListState<ICreateOptionSchema>()
  useDeepCompareEffect(() => {
    onChange(options)
  }, [options])

  const items = options.map((o) => o.id as string)

  return (
    <Stack spacing={0}>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={(e) => {
          const { over, active } = e
          if (over) {
            handlers.reorder({
              from: active.data.current?.sortable?.index,
              to: over?.data.current?.sortable?.index,
            })
          }
        }}
      >
        <SortableContext items={items}>
          {options.map((o, index) => (
            <OptionControl key={o.id} option={o} onChange={(name) => handlers.setItemProp(index, 'name', name)} />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        leftIcon={<IconSelect size={14} />}
        size="xs"
        variant="subtle"
        onClick={() => handlers.append({ id: OptionId.create().value, name: '' })}
      >
        Add new option
      </Button>
    </Stack>
  )
}
