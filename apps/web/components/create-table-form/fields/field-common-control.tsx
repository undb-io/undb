import { ActionIcon, Text, Button, Group, IconDots, Menu } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useCreateTableFormContext } from '../create-table-form-context'
import { fieldValueAtom } from '../create-table-form-schema.atom'

interface IProps {
  index: number
}

export const FieldCommonControl: React.FC<IProps> = ({ index }) => {
  const form = useCreateTableFormContext()

  const [, setOpened] = useAtom(fieldValueAtom)
  return (
    <Group position="right">
      <Menu>
        <Menu.Target>
          <ActionIcon variant="subtle" color="dark">
            <IconDots size={14} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item h={30} color="red" onClick={() => form.removeListItem('schema', index)}>
            <Text size={14}>remove</Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Button size="xs" variant="outline" color="dark" onClick={() => setOpened(null)}>
        Done
      </Button>
    </Group>
  )
}
