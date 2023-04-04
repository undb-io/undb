import { useGetTablesQuery } from '@egodb/store'
import type { SelectItem, SelectProps } from '@egodb/ui'
import { Select } from '@egodb/ui'
import { useTranslation } from 'react-i18next'
import { FieldInputLabel } from '../field-inputs/field-input-label'

type IProps = Omit<SelectProps, 'data'>

export const TablePicker: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const { items } = useGetTablesQuery(
    {},
    {
      selectFromResult: (tables) => ({
        items: Object.values(tables.data?.entities ?? {})
          .filter(Boolean)
          .map<SelectItem>((table) => ({ value: table.id, label: table.name })),
      }),
    },
  )

  return <Select label={<FieldInputLabel>{t('Foreign Table')}</FieldInputLabel>} {...props} data={items} withinPortal />
}
