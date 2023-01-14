import { Badge, Button, Checkbox, Group, IconEye, Popover, Stack, useDisclosure } from '@egodb/ui'
import { trpc } from '../../trpc'
import { FieldIcon } from '../fields/field-Icon'
import type { ITableBaseProps } from './table-base-props'

export const TableFieldVisibilityEditor: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, handler] = useDisclosure(false)
  const utils = trpc.useContext()
  const setFieldVisibility = trpc.table.view.field.setVisibility.useMutation({
    onSuccess() {
      utils.table.get.refetch()
    },
  })
  const view = table.mustGetView()
  const visibility = view.getVisibility()
  const hiddenCount = view.fieldOptions?.hiddenCount ?? 0

  const onChange = (fieldKey: string, visible: boolean) => {
    setFieldVisibility.mutate({ tableId: table.id.value, fieldKey, hidden: !visible })
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
          loading={setFieldVisibility.isLoading}
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
              onChange={(e) => onChange(f.key.value, e.target.checked)}
              defaultChecked={visibility[f.key.value] === undefined || !!visibility[f.key.value]}
              key={f.key.value}
              value={f.key.value}
              label={
                <Group spacing="xs">
                  <FieldIcon type={f.type} />
                  {f.key.value}
                </Group>
              }
            />
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
