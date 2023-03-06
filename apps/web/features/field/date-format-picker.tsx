import { BUILT_IN_DATE_FORMATS } from '@egodb/core'
import type { SelectItem, SelectProps } from '@egodb/ui'
import { Select } from '@egodb/ui'
import { useTranslation } from 'react-i18next'
import { FieldInputLabel } from '../field-inputs/field-input-label'

const data = BUILT_IN_DATE_FORMATS.map<SelectItem>((format) => ({ value: format, label: format }))

type IProps = Omit<SelectProps, 'data'>

export const DateFormatPicker: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  return <Select withinPortal label={<FieldInputLabel>{t('Date Format')}</FieldInputLabel>} {...props} data={data} />
}
