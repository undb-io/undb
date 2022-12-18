import { ActionIcon, Group, IconCopy, IconDots, Menu, useClipboard } from '@egodb/ui'
import type { TRow } from './interface'

export const RecordActions: React.FC<{ row: TRow }> = ({ row }) => {
  const { copy } = useClipboard({ timeout: 500 })
  return (
    <Group>
      <Menu>
        <Menu.Target>
          <ActionIcon onClick={(e) => e.stopPropagation()} size="sm">
            <IconDots />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={(e) => {
              e.stopPropagation()
              copy(row.id)
            }}
            icon={<IconCopy size={14} />}
          >
            Copy Record Id
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
