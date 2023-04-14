import { useGetUsersQuery } from '@undb/store'
import type { MultiSelectProps, SelectItem } from '@undb/ui'
import { MultiSelect, useDisclosure } from '@undb/ui'
import { uniq } from 'lodash-es'

type IProps = Omit<MultiSelectProps, 'data'>

export const UsersPicker: React.FC<IProps> = (props) => {
  const [focused, handler] = useDisclosure()
  const { data, isLoading } = useGetUsersQuery({}, { skip: !focused })

  const ids = uniq([...(props.value ?? []), ...(data?.ids ?? [])]).filter(Boolean)
  const items: SelectItem[] = ids.map((id) => ({
    value: id as string,
    label: data?.entities[id as string]?.username ?? '',
  }))

  return (
    <MultiSelect
      {...props}
      multiple
      searchable
      clearable
      onBlur={handler.close}
      onFocus={handler.open}
      disabled={focused && isLoading}
      data={items}
    />
  )
}
