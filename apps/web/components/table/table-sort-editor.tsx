import type { Table } from '@egodb/core'
import { useSetSortMutation } from '@egodb/store'
import { Badge, Button, IconArrowsSort, Popover, useDisclosure } from '@egodb/ui'
import { SortsEditor } from '../sorts-editor/sorts-editor'

interface IProps {
  table: Table
}

export const TableSortEditor: React.FC<IProps> = ({ table }) => {
  const [opened, toggle] = useDisclosure(false)
  const [setSortsReq] = useSetSortMutation()
  const sorts = table.mustGetView().sorts?.sorts ?? []

  return (
    <Popover opened={opened} onChange={toggle.toggle} position="bottom-start" closeOnClickOutside shadow="md">
      <Popover.Target>
        <Button
          compact
          size="xs"
          variant={sorts.length ? 'light' : 'subtle'}
          leftIcon={<IconArrowsSort size={16} />}
          onClick={toggle.toggle}
          rightIcon={
            sorts.length ? (
              <Badge variant="filled" size="xs">
                {sorts.length}
              </Badge>
            ) : null
          }
        >
          Sort
        </Button>
      </Popover.Target>

      <Popover.Dropdown miw={300}>
        <SortsEditor
          table={table}
          onCancel={toggle.close}
          onApply={(values) => {
            setSortsReq({
              tableId: table.id.value,
              sorts: values,
            }).then(() => toggle.close())
          }}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
