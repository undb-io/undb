import { DndContext, rectIntersection } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { OptionKey } from '@egodb/core'
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
  IconTrash,
  Grid,
} from '@egodb/ui'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { CSS } from '@dnd-kit/utilities'
import type { ICreateOptionSchema, IMutateOptionSchema } from '@egodb/core'
import { OptionColor } from '@egodb/core'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { OptionColorPicker } from './option-color-picker'
import type { OnColorChange } from './type'
import { useTranslation } from 'react-i18next'

interface IOptionControlProps {
  option: ICreateOptionSchema
  onNameChange: (name: string) => void
  onColorChange: OnColorChange
  onRemove: () => void
}

const OptionControl: React.FC<IOptionControlProps> = ({ option, onNameChange, onColorChange, onRemove }) => {
  const { listeners, attributes, setNodeRef, transform, transition } = useSortable({ id: option.key as string })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const { t } = useTranslation()

  return (
    <Grid align="center" grow ref={setNodeRef} style={style}>
      <Grid.Col span={1}>
        <ActionIcon {...listeners} {...attributes}>
          <IconGripVertical size={14} color="gray" />
        </ActionIcon>
      </Grid.Col>

      <Grid.Col span={9}>
        <Group>
          <OptionColorPicker onChange={onColorChange} option={option} />
          <FocusTrap>
            <TextInput
              variant="unstyled"
              value={option.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t('Option Name') as string}
            />
          </FocusTrap>
        </Group>
      </Grid.Col>

      <Grid.Col span={1}>
        <ActionIcon onClick={() => onRemove()}>
          <IconTrash size={14} color="gray" />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  )
}

interface ISelectFieldControlProps {
  value: IMutateOptionSchema[]
  onChange: (options: IMutateOptionSchema[]) => void
}

export const SelectFieldControl: React.FC<ISelectFieldControlProps> = ({ onChange, value }) => {
  const [options, handlers] = useListState<IMutateOptionSchema>(value)
  useDeepCompareEffect(() => {
    onChange(options)
  }, [options])

  const items = options.map((o) => o.key as string)
  const [parent, enableAnimations] = useAutoAnimate({ duration: 200 })

  useDeepCompareEffect(() => {
    requestAnimationFrame(() => {
      enableAnimations(true)
    })
  }, [items])

  const { t } = useTranslation()

  return (
    <Stack spacing={0}>
      <div ref={parent as any}>
        <DndContext
          collisionDetection={rectIntersection}
          modifiers={[restrictToVerticalAxis]}
          onDragStart={() => enableAnimations(false)}
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
              <OptionControl
                key={o.key}
                option={o}
                onNameChange={(name) => handlers.setItemProp(index, 'name', name)}
                onColorChange={(color) => handlers.setItemProp(index, 'color', color)}
                onRemove={() => handlers.remove(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <Button
        leftIcon={<IconSelect size={14} />}
        size="xs"
        variant="subtle"
        onClick={() => {
          const length = options.length
          const color =
            length === 0
              ? OptionColor.defaultColor
              : OptionColor.create(options[length - 1]?.color)
                  .next()
                  .unpack()
          handlers.append({
            key: OptionKey.create().value,
            name: '',
            color: {
              name: color.name,
              shade: color.shade,
            },
          })
        }}
      >
        {t('Create New Option')}
      </Button>
    </Stack>
  )
}
