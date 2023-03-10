import type { AutoIncrementField } from '@egodb/core'
import { getCurrentTableRecordsTotal } from '@egodb/store'
import { NumberInput } from '@egodb/ui'
import { isNumber } from 'lodash-es'
import { useAppSelector } from '../../hooks'
import { FieldIcon } from './field-Icon'
import { FieldInputLabel } from './field-input-label'

interface IProps {
  field: AutoIncrementField
  defaultValue?: number
}

export const AutoIncrementInput: React.FC<IProps> = ({ field, defaultValue }) => {
  let value = defaultValue

  const total = useAppSelector(getCurrentTableRecordsTotal)

  if (!isNumber(value)) {
    value = total + 1
  }
  return (
    <NumberInput
      label={<FieldInputLabel>{field.name.value}</FieldInputLabel>}
      readOnly
      disabled
      defaultValue={value}
      icon={<FieldIcon type={field.type} />}
    />
  )
}
