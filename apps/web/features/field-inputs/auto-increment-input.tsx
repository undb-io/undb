import type { AutoIncrementField } from '@egodb/core'
import { getTableSelectedRecordIdsCount } from '@egodb/store'
import { NumberInput } from '@egodb/ui'
import { isNumber } from 'lodash-es'
import { useAppSelector } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { FieldIcon } from './field-Icon'
import { FieldInputLabel } from './field-input-label'

interface IProps {
  field: AutoIncrementField
  defaultValue?: number
}

export const AutoIncrementInput: React.FC<IProps> = ({ field, defaultValue }) => {
  const table = useCurrentTable()
  let value = defaultValue

  const totalCount = useAppSelector((state) => getTableSelectedRecordIdsCount(state, table.id.value))

  if (!isNumber(value)) {
    value = totalCount + 1
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
