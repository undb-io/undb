import { BUILT_IN_DATE_FORMATS, DEFAULT_DATE_FORMAT } from '@undb/core'
import type { SelectItem, SelectProps } from '@undb/ui'
import { Select } from '@undb/ui'
import { useTranslation } from 'react-i18next'
import { FieldInputLabel } from '../field-inputs/field-input-label'

const data = BUILT_IN_DATE_FORMATS.map<SelectItem>((format) => ({ value: format, label: format }))

type IProps = Omit<SelectProps, 'data'>

export const DateFormatPicker: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  return (
    <Select
      withinPortal
      label={<FieldInputLabel>{t('Date Format')}</FieldInputLabel>}
      defaultValue={DEFAULT_DATE_FORMAT}
      {...props}
      data={data}
    />
  )
}
