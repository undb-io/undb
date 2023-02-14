import { closestCenter, DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Field } from '@egodb/core'
import { useMoveFieldMutation, useSetVisibilityMutation } from '@egodb/store'
import type { CheckboxProps } from '@egodb/ui'
import { useListState } from '@egodb/ui'
import { ActionIcon, IconGripVertical } from '@egodb/ui'
import { Tooltip } from '@egodb/ui'
import { Badge, Button, Checkbox, Group, IconEye, Popover, Stack, useDisclosure } from '@egodb/ui'
import { useEffect } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { FieldIcon } from '../field-inputs/field-Icon'

type OnVisibleChange = (fieldId: string, visible: boolean) => void

interface IFieldItemProps extends CheckboxProps {
  onVisibleChange: OnVisibleChange
  field: Field
}

const FieldItem: React.FC<IFieldItemProps> = ({ field: f, onVisibleChange, ...rest }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: f.id.value })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Group spacing="xs" ref={setNodeRef} style={style}>
      <ActionIcon size="xs" {...attributes} {...listeners}>
        <IconGripVertical size={14} />
      </ActionIcon>
      <Checkbox
        lh={1}
        size="xs"
        onChange={(e) => onVisibleChange(f.id.value, e.target.checked)}
        key={f.id.value}
        value={f.id.value}
        label={
          <Group spacing="xs">
            <FieldIcon type={f.type} />
            {f.name.value}
          </Group>
        }
        {...rest}
      />
    </Group>
  )
}

export const ViewFieldsEditor: React.FC = () => {
  const table = useCurrentTable()
  const [opened, handler] = useDisclosure(false)
  const [setFieldVisibility, { isLoading }] = useSetVisibilityMutation()

  const view = useCurrentView()
  const visibility = view.getVisibility()
  const schema = table.schema.toIdMap()
  const hiddenCount = view.fieldOptions?.hiddenCount ?? 0

  const [order, handlers] = useListState(table.getFieldsOrder(view).order)

  useEffect(() => {
    handlers.setState(table.getFieldsOrder(view).order)
  }, [table])

  const onChange: OnVisibleChange = (fieldId: string, visible: boolean) => {
    setFieldVisibility({ tableId: table.id.value, viewId: view.id.value, fieldId, hidden: !visible })
  }

  const [moveField] = useMoveFieldMutation()

  return (
    <Popover
      width={250}
      position="bottom-start"
      opened={opened}
      onChange={handler.toggle}
      closeOnClickOutside
      shadow="md"
    >
      <Popover.Target>
        <Tooltip label="reorder or hide fields">
          <Button
            variant={hiddenCount ? 'light' : 'subtle'}
            compact
            size="xs"
            loading={isLoading}
            leftIcon={<IconEye size={18} />}
            onClick={handler.toggle}
            rightIcon={
              hiddenCount ? (
                <Badge variant="filled" size="xs">
                  {hiddenCount}
                </Badge>
              ) : null
            }
          >
            Fields
          </Button>
        </Tooltip>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
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

                moveField({
                  tableId: table.id.value,
                  viewId: view.id.value,
                  from: active.id as string,
                  to: over.id as string,
                })
              }
            }}
          >
            <SortableContext items={order} strategy={verticalListSortingStrategy}>
              {order.map((fieldId) => {
                const field = schema.get(fieldId)
                if (!field) return null
                return (
                  <FieldItem
                    key={field.id.value}
                    field={field}
                    onVisibleChange={onChange}
                    defaultChecked={visibility[field.id.value] === undefined || !!visibility[field.id.value]}
                  />
                )
              })}
            </SortableContext>
          </DndContext>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
