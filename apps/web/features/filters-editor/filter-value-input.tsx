import { ColorField, CreatedAtField, EmailField, IdField, RatingField, UpdatedAtField } from '@egodb/core'
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
import { ColorInput, DatePickerInput, NumberInput, Rating, TextInput } from '@egodb/ui'
import { OptionPicker } from '../option/option-picker'
import { RecordsPicker } from '../field-inputs/records-picker'
import { castArray } from 'lodash-es'
import { useColors } from '../../hooks/use-colors'

interface IProps {
  field: Field | null
  operator: IOperator | null
  value: IFieldQueryValue
  onChange: (v: IFieldQueryValue) => void
}

export const FilterValueInput: React.FC<IProps> = ({ operator, field, value, onChange }) => {
  const colors = useColors()

  if (!field) {
    return null
  }

  if (field instanceof StringField || field instanceof EmailField) {
    return (
      <TextInput
        size="xs"
        variant="filled"
        value={(value ?? '') as string}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }

  if (field instanceof ColorField) {
    return (
      <ColorInput
        size="xs"
        variant="filled"
        onChange={(color) => onChange(color)}
        value={(value as string) ?? ''}
        swatches={colors}
        withinPortal
        closeOnColorSwatchClick
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
