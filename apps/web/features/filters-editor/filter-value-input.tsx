import { CreatedAtField, IdField, RatingField, UpdatedAtField } from '@egodb/core'
import { DateRangeField } from '@egodb/core'
import { SelectField } from '@egodb/core'
import { StringField } from '@egodb/core'
import { dateBuiltInOperators } from '@egodb/core'
import { DateField } from '@egodb/core'
import { NumberField } from '@egodb/core'
import type {
  IDateRangeFieldValue,
  Field,
  IDateFilterOperator,
  IFieldQueryValue,
  IOperator,
  IRatingFieldValue,
} from '@egodb/core'
import { DatePickerInput, NumberInput, Rating, TextInput } from '@egodb/ui'
import { OptionPicker } from '../option/option-picker'
import { RecordsPicker } from '../field-inputs/records-picker'
import { castArray } from 'lodash-es'

interface IProps {
  field: Field | null
  operator: IOperator | null
  value: IFieldQueryValue
  onChange: (v: IFieldQueryValue) => void
}

export const FilterValueInput: React.FC<IProps> = ({ operator, field, value, onChange }) => {
  if (!field) {
    return null
  }

  if (field instanceof StringField) {
    return (
      <TextInput
        size="xs"
        variant="filled"
        value={(value ?? '') as string}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }

  if (field instanceof NumberField) {
    return (
      <NumberInput size="xs" variant="filled" value={value as number} onChange={(number) => onChange(number || null)} />
    )
  }

  if (field instanceof DateField || field instanceof CreatedAtField || field instanceof UpdatedAtField) {
    if (dateBuiltInOperators.has(operator as IDateFilterOperator)) {
      return null
    }
    return (
      <DatePickerInput
        size="xs"
        variant="filled"
        miw={150}
        value={value ? new Date(value as string) : new Date()}
        onChange={(date) => onChange(date?.toISOString() || null)}
        valueFormat={field.formatString.toUpperCase()}
      />
    )
  }

  if (field instanceof DateRangeField) {
    return (
      <DatePickerInput
        size="xs"
        variant="filled"
        type="range"
        value={(value as IDateRangeFieldValue) ?? undefined}
        onChange={(range) => onChange([range.at(0)?.toISOString() ?? null, range.at(1)?.toISOString() ?? null])}
      />
    )
  }

  if (field instanceof RatingField) {
    return (
      <Rating
        size="xs"
        value={(value as IRatingFieldValue) ?? 0}
        count={field.max}
        onChange={(value) => onChange(value)}
      />
    )
  }

  if (field instanceof SelectField) {
    return (
      <OptionPicker
        size="xs"
        variant="filled"
        value={value as string}
        field={field}
        onChange={(option) => onChange(option || null)}
      />
    )
  }

  if (field instanceof IdField) {
    if (operator === '$eq' || operator === '$neq') {
      return (
        <TextInput
          size="xs"
          variant="filled"
          value={value as string}
          onChange={(event) => onChange(event.target.value)}
        />
      )
    }

    if (operator === '$in' || operator === '$nin') {
      return (
        <RecordsPicker
          size="xs"
          variant="filled"
          value={castArray(value) as string[]}
          onChange={(value) => onChange(value)}
        />
      )
    }

    return null
  }

  return null
}
