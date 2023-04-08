import {
  AttachmentField,
  AutoIncrementField,
  AverageField,
  ColorField,
  CountField,
  CreatedAtField,
  EmailField,
  IdField,
  RatingField,
  SumField,
  UpdatedAtField,
  isOperatorWithoutValue,
} from '@undb/core'
import { DateRangeField } from '@undb/core'
import { SelectField } from '@undb/core'
import { StringField } from '@undb/core'
import { dateBuiltInOperators } from '@undb/core'
import { DateField } from '@undb/core'
import { NumberField } from '@undb/core'
import type {
  IDateRangeFieldValue,
  Field,
  IDateFilterOperator,
  IFieldQueryValue,
  IOperator,
  IRatingFieldValue,
} from '@undb/core'
import { ColorInput, DatePickerInput, Rating, Select, TextInput } from '@undb/ui'
import { OptionPicker } from '../option/option-picker'
import { RecordsPicker } from '../field-inputs/records-picker'
import { castArray } from 'lodash-es'
import { useColors } from '../../hooks/use-colors'
import { useTranslation } from 'react-i18next'

interface IProps {
  field: Field | null
  operator: IOperator | null
  value: IFieldQueryValue
  onChange: (v: IFieldQueryValue) => void
}

export const FilterValueInput: React.FC<IProps> = ({ operator, field, value, onChange }) => {
  const colors = useColors()
  const { t } = useTranslation()

  if (!field) {
    return null
  }

  if (!operator) {
    return null
  }

  if (isOperatorWithoutValue(operator)) {
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
        withinPortal={false}
        closeOnColorSwatchClick
      />
    )
  }

  if (
    field instanceof NumberField ||
    field instanceof CountField ||
    field instanceof SumField ||
    field instanceof AverageField ||
    field instanceof AutoIncrementField
  ) {
    return (
      <TextInput
        type="number"
        size="xs"
        variant="filled"
        value={value as number}
        onChange={(e) => onChange(Number(e.target.value) ?? null)}
      />
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

  if (field instanceof AttachmentField) {
    if (operator === '$has_file_type') {
      return (
        <Select
          size="xs"
          variant="filled"
          value={value as string}
          onChange={(item) => onChange(item)}
          data={[
            { value: 'image', label: t('Image', { ns: 'common' }) as string },
            { value: 'text', label: t('Text', { ns: 'common' }) as string },
            { value: 'video', label: t('Video', { ns: 'common' }) as string },
            { value: 'document', label: t('Document', { ns: 'common' }) as string },
            { value: 'excel', label: t('Excel', { ns: 'common' }) as string },
            { value: 'ppt', label: t('PPT', { ns: 'common' }) as string },
            { value: 'pdf', label: t('PDF', { ns: 'common' }) as string },
          ]}
        />
      )
    }

    if (operator === '$has_file_extension') {
      return (
        <Select
          size="xs"
          variant="filled"
          value={value as string}
          onChange={(item) => onChange(item)}
          data={[
            { value: '.pdf', label: '.pdf' },
            { value: '.docx', label: '.docx' },
            { value: '.xlsx', label: '.xlsx' },
            { value: '.pptx', label: '.pptx' },
            { value: '.txt', label: '.txt' },
          ]}
        />
      )
    }

    return null
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
          value={castArray(value as any) as string[]}
          onChange={(value) => onChange(value)}
        />
      )
    }

    return null
  }

  return null
}
