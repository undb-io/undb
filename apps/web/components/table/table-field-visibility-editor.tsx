import { Button, Checkbox, IconEye, Popover, Stack, useDisclosure } from '@egodb/ui'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from './table-base-props'

export const TableFieldVisibilityEditor: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, handler] = useDisclosure(false)
  const utils = trpc.useContext()
  const setFieldVisibility = trpc.table.setFieldVisibility.useMutation({
    onSuccess() {
      utils.table.get.refetch()
    },
  })
  const visibility = table.getOrCreateDefaultView().getVisibility()

  const onChange = (fieldName: string, visible: boolean) => {
    setFieldVisibility.mutate({ tableId: table.id.value, fieldName, hidden: !visible })
  }

  return (
    <Popover width={250} position="bottom-start" opened={opened} onChange={handler.toggle} closeOnClickOutside>
      <Popover.Target>
        <Button
          variant="outline"
          size="xs"
          loading={setFieldVisibility.isLoading}
          leftIcon={<IconEye size={18} />}
          onClick={handler.toggle}
        >
          Hide Fields
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          {table.schema.fields.map((f) => (
            <Checkbox
              onChange={(e) => onChange(f.name.value, e.target.checked)}
              defaultChecked={visibility[f.name.value] === undefined || !!visibility[f.name.value]}
              key={f.id.value}
              value={f.name.value}
              label={f.name.value}
            />
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
