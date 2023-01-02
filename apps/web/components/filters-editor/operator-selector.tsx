import type { Field, IOperator } from '@egodb/core'
import { DateRangeField } from '@egodb/core'
import { SelectField } from '@egodb/core'
import { StringField } from '@egodb/core'
import { BoolField } from '@egodb/core'
import { DateField } from '@egodb/core'
import { NumberField } from '@egodb/core'
import { DateFieldValue } from '@egodb/core/field/date-field-value'
import type { SelectItem } from '@egodb/ui'
import { Select } from '@egodb/ui'

interface IProps {
  field: Field | null
  value: IOperator | null
  onChange: (operator: IOperator | null) => void
}

export const OperatorSelector: React.FC<IProps> = ({ value, field, onChange }) => {
  let data: SelectItem[] = []

  // TODO: optimize if else
  if (field instanceof StringField) {
    data = [
      { value: '$eq', label: 'equal' },
      { value: '$neq', label: 'not equal' },
      { value: '$contains', label: 'contains' },
      { value: '$starts_with', label: 'startsWith' },
      { value: '$ends_with', label: 'endsWith' },
      { value: '$regex', label: 'regex' },
    ]
  } else if (field instanceof NumberField) {
    data = [
      { value: '$eq', label: 'equal' },
      { value: '$neq', label: 'not equal' },
      { value: '$gt', label: 'greater than' },
      { value: '$gte', label: 'greater than or equal' },
      { value: '$lt', label: 'less than' },
      { value: '$lte', label: 'less than or equal' },
    ]
  } else if (field instanceof DateField) {
    data = [
      { value: '$eq', label: 'equal' },
      { value: '$neq', label: 'not equal' },
      { value: '$gt', label: 'greater than' },
      { value: '$gte', label: 'greater than or equal' },
      { value: '$lt', label: 'less than' },
      { value: '$lte', label: 'less than or equal' },
      { value: '$is_today', label: 'is today' },
    ]
  } else if (field instanceof DateRangeField) {
    data = [
      { value: '$eq', label: 'equal' },
      { value: '$neq', label: 'not equal' },
    ]
  } else if (field instanceof BoolField) {
    data = [
      { value: '$is_true', label: 'is true' },
      { value: '$is_false', label: 'is false' },
    ]
  } else if (field instanceof SelectField) {
    data = [
      { value: '$eq', label: 'equal' },
      { value: '$neq', label: 'not equal' },
      { value: '$in', label: 'in' },
      { value: '$nin', label: 'not in' },
    ]
  }

  return (
    <Select value={value} disabled={!field} data={data} onChange={(value) => onChange(value as IOperator | null)} />
  )
}
