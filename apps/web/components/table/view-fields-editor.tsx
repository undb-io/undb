import { closestCenter, DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Field } from '@egodb/core'
import { useSetVisibilityMutation } from '@egodb/store'
import type { CheckboxProps } from '@egodb/ui'
import { Tooltip } from '@egodb/ui'
import { Badge, Button, Checkbox, Group, IconEye, Popover, Stack, useDisclosure } from '@egodb/ui'
import { FieldIcon } from '../field-inputs/field-Icon'
import type { ITableBaseProps } from './table-base-props'

type OnVisibleChange = (fieldId: string, visible: boolean) => void

interface IFieldItemProps extends CheckboxProps {
  onVisibleChange: OnVisibleChange
  field: Field
}

const FieldItem: React.FC<IFieldItemProps> = ({ field: f, onVisibleChange, ...rest }) => {
  return (
    <Group>
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

export const ViewFieldsEditor: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, handler] = useDisclosure(false)
  const [setFieldVisibility, { isLoading }] = useSetVisibilityMutation()

  const view = table.mustGetView()
  const visibility = view.getVisibility()
  const hiddenCount = view.fieldOptions?.hiddenCount ?? 0

  const order = table.getFieldsOrder(view).order

  const onChange: OnVisibleChange = (fieldId: string, visible: boolean) => {
    setFieldVisibility({ tableId: table.id.value, fieldId, hidden: !visible })
  }

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
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={console.log}>
            <SortableContext items={order} strategy={verticalListSortingStrategy}>
              {table.schema.fields.map((field) => (
                <FieldItem
                  key={field.id.value}
                  field={field}
                  onVisibleChange={onChange}
                  defaultChecked={visibility[field.id.value] === undefined || !!visibility[field.id.value]}
                />
              ))}
            </SortableContext>
          </DndContext>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
