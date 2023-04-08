import type { AutoIncrementField } from '@undb/core'
import { getCurrentTableRecordsTotal } from '@undb/store'
import type { NumberInputProps } from '@undb/ui'
import { NumberInput } from '@undb/ui'
import { isNumber } from 'lodash-es'
import { useAppSelector } from '../../hooks'
import { FieldIcon } from './field-Icon'
import { FieldInputLabel } from './field-input-label'

interface IProps extends NumberInputProps {
  field: AutoIncrementField
  defaultValue?: number
}

export const AutoIncrementInput: React.FC<IProps> = ({ field, defaultValue, ...props }) => {
  let value = defaultValue

  const total = useAppSelector(getCurrentTableRecordsTotal)

  if (!isNumber(value)) {
    value = total + 1
  }
  return (
    <NumberInput
      {...props}
      label={<FieldInputLabel>{field.name.value}</FieldInputLabel>}
      readOnly
      disabled
      defaultValue={value}
      icon={<FieldIcon type={field.type} />}
    />
  )
}
