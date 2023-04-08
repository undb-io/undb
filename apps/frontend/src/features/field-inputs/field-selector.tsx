import type { Field } from '@undb/core'
import { Select } from '@undb/ui'
import { useTranslation } from 'react-i18next'
import { FieldIcon } from './field-Icon'
import { FieldItem } from './field-item'
interface IProps {
  fields: Field[]
  value: Field | null
  onChange: (field: Field | null) => void
}

export const FieldSelector: React.FC<IProps> = ({ fields, value, onChange }) => {
  const { t } = useTranslation()
  return (
    <Select
      searchable
      clearable
      value={value?.id.value}
      size="xs"
      variant="filled"
      onChange={(value) => {
        const selectedColumn = value ? fields.find((f) => f.id.value === value) ?? null : null
        onChange(selectedColumn)
      }}
      placeholder={t('Search Field') as string}
      itemComponent={FieldItem}
      data={fields.map((f) => ({
        value: f.id.value,
        label: f.name.value,
        type: f.type,
      }))}
      icon={value?.type ? <FieldIcon type={value.type} /> : null}
      withinPortal
    />
  )
}
