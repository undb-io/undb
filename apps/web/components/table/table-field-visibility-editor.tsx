import { useSetVisibilityMutation } from '@egodb/store'
import { Badge, Button, Checkbox, Group, IconEye, Popover, Stack, useDisclosure } from '@egodb/ui'
import { FieldIcon } from '../field-inputs/field-Icon'
import type { ITableBaseProps } from './table-base-props'

export const TableFieldVisibilityEditor: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, handler] = useDisclosure(false)
  const [setFieldVisibility, { isLoading }] = useSetVisibilityMutation()

  const view = table.mustGetView()
  const visibility = view.getVisibility()
  const hiddenCount = view.fieldOptions?.hiddenCount ?? 0

  const onChange = (fieldId: string, visible: boolean) => {
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
          Hide Fields
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          {table.schema.fields.map((f) => (
            <Checkbox
              lh={1}
              size="xs"
              onChange={(e) => onChange(f.id.value, e.target.checked)}
              defaultChecked={visibility[f.id.value] === undefined || !!visibility[f.id.value]}
              key={f.id.value}
              value={f.id.value}
              label={
                <Group spacing="xs">
                  <FieldIcon type={f.type} />
                  {f.name.value}
                </Group>
              }
            />
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
