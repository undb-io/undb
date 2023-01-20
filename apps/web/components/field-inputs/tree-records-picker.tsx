import type { Table, TreeField } from '@egodb/core'
import type { MultiSelectProps } from '@egodb/ui'
import { Loader, MultiSelect } from '@egodb/ui'
import { useState } from 'react'
import { trpc } from '../../trpc'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  table: Table
  field: TreeField
}

export const TreeRecordsPicker: React.FC<IProps> = ({ table, field, ...rest }) => {
  const [focused, setFocused] = useState(false)
  const getRecords = trpc.record.tree.available.useQuery(
    {
      tableId: table.id.value,
      treeFieldId: field.id.value,
    },
    {
      enabled: focused,
    },
  )

  return (
    <MultiSelect
      {...rest}
      data={[]}
      searchable
      clearable
      onFocus={() => setFocused(true)}
      placeholder={focused && getRecords.isLoading ? 'loading records...' : undefined}
      disabled={focused && getRecords.isLoading}
      icon={focused && getRecords.isLoading ? <Loader color="gray" size={14} /> : null}
    />
  )
}
