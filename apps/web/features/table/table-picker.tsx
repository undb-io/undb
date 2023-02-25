import { useGetTablesQuery } from '@egodb/store'
import type { SelectItem, SelectProps } from '@egodb/ui'
import { Select } from '@egodb/ui'
import { FieldInputLabel } from '../field-inputs/field-input-label'

type IProps = Omit<SelectProps, 'data'>

export const TablePicker: React.FC<IProps> = (props) => {
  const { items } = useGetTablesQuery(
    {},
    {
      selectFromResult: (tables) => ({
        items: Object.values(tables.data?.entities ?? {})
          .filter(Boolean)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map<SelectItem>((table) => ({ value: table!.id, label: table!.name })),
      }),
    },
  )

  return <Select label={<FieldInputLabel>foreign table</FieldInputLabel>} {...props} data={items} />
}
