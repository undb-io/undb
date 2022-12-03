import { ActionIcon, Text, Button, Group, IconDots, Menu } from '@egodb/ui'
import { useResetAtom } from 'jotai/utils'
import { useCreateTableFormContext } from '../create-table-form-context'
import { activeFieldAtom } from '../create-table-form-schema.atom'

interface IProps {
  index: number
}

export const FieldCommonControl: React.FC<IProps> = ({ index }) => {
  const form = useCreateTableFormContext()

  const resetActiveField = useResetAtom(activeFieldAtom)
  return (
    <Group position="right">
      <Menu>
        <Menu.Target>
          <ActionIcon variant="subtle">
            <IconDots size={14} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item h={30} color="red" onClick={() => form.removeListItem('schema', index)}>
            <Text size={14}>remove</Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Button size="xs" variant="outline" onClick={resetActiveField}>
        Done
      </Button>
    </Group>
  )
}
