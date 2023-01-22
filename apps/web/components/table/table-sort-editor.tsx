import type { Table } from '@egodb/core'
import type { ISorts } from '@egodb/core'
import { Button, IconArrowsSort, Popover, useDisclosure } from '@egodb/ui'
import { useState } from 'react'
import { trpc } from '../../trpc'
import { SortsEditor } from '../sorts-editor/sorts-editor'

interface IProps {
  table: Table
}

export const TableSortEditor: React.FC<IProps> = ({ table }) => {
  const utils = trpc.useContext()

  const [opened, toggle] = useDisclosure(false)
  const setSortsReq = trpc.table.view.sort.set.useMutation({
    onSuccess() {
      toggle.close()
      utils.table.get.refetch()
    },
  })
  const [sorts, setSorts] = useState<ISorts>([])

  return (
    <Popover opened={opened} onClose={toggle.close} position="bottom-start" closeOnClickOutside shadow="md">
      <Popover.Target>
        <Button compact size="xs" variant="subtle" leftIcon={<IconArrowsSort size={16} onClick={toggle.toggle} />}>
          Sort
        </Button>
      </Popover.Target>

      <Popover.Dropdown miw={300}>
        <SortsEditor
          table={table}
          onChange={setSorts}
          onApply={() => {
            setSortsReq.mutate({
              tableId: table.id.value,
              sorts,
            })
          }}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
