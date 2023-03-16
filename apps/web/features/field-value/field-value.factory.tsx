import type {
  BoolFieldValue,
  ColorFieldValue,
  DateFieldValue,
  DateRangeFieldValue,
  Field,
  ParentFieldValue,
  RatingFieldValue,
  RecordAllValueType,
  ReferenceFieldValue,
  SelectFieldValue,
  TreeFieldValue,
} from '@egodb/core'
import React from 'react'
import { ReferenceValue } from './reference-value'
import { BoolValue } from './bool-value'
import { DateRangeValue } from './date-range-value'
import { DateValue } from './date-value'
import { RecordId } from './record-id'
import { Flex, Group, Rating, Text } from '@egodb/ui'
import type { FieldValue } from '@egodb/core'
import { Option } from '../option/option'
import { ColorValue } from './color-value'
import type { IRecordDisplayValues } from '@egodb/core'
import { isNumber } from 'lodash-es'

export const FieldValueFactory: React.FC<{
  field: Field
  value: RecordAllValueType
  displayValues?: IRecordDisplayValues
  // eslint-disable-next-line react/display-name
}> = React.memo(({ field, value, displayValues }) => {
  switch (field.type) {
    case 'id': {
      return <RecordId id={value as string} />
    }
    case 'updated-at':
    case 'created-at': {
      const date = value as Date | string | undefined
      if (!date) return null
      return <DateValue field={field} value={date instanceof Date ? date : new Date(date)} />
    }
    case 'select': {
      const option = (value as SelectFieldValue | undefined)?.getOption(field).into()
      if (!option) return null
      return <Option name={option.name.value} colorName={option.color.name} shade={option.color.shade} />
    }
    case 'date': {
      const date = (value as DateFieldValue | undefined)?.unpack() ?? undefined
      return <DateValue value={date} field={field} />
    }
    case 'date-range': {
      const date = (value as DateRangeFieldValue | undefined)?.unpack() ?? undefined
      return <DateRangeValue field={field} value={date} />
    }
    case 'auto-increment': {
      const n = value as number | undefined
      return isNumber(n) ? <>{n}</> : null
    }
    case 'rating': {
      const n = (value as RatingFieldValue | undefined)?.unpack() ?? undefined
      return isNumber(n) ? <Rating value={n} count={field.max} readOnly size="xs" /> : null
    }
    case 'bool': {
      const b = (value as BoolFieldValue | undefined)?.unpack() ?? false
      return <BoolValue value={b} />
    }
    case 'color': {
      const color = (value as ColorFieldValue | undefined)?.unpack() || undefined
      if (!color) return null
      return <ColorValue value={color} />
    }
    case 'parent': {
      if (!(value as ParentFieldValue | undefined)?.unpack()) return null
      const values = field.getDisplayValues(displayValues)[0]
      return <ReferenceValue values={values} />
    }
    case 'reference':
    case 'tree': {
      const unpacked = (value as ReferenceFieldValue | TreeFieldValue | undefined)?.unpack()
      if (!unpacked) return null
      const values = field.getDisplayValues(displayValues)

      if (unpacked?.length && !values?.length) {
        return (
          <Group spacing={3}>
            {unpacked.map((_, index) => (
              <ReferenceValue key={index} />
            ))}
          </Group>
        )
      }

      return (
        <Group spacing={3}>
          {values.map((value, index) => (
            <ReferenceValue key={index} values={value} />
          ))}
        </Group>
      )
    }

    default:
      return <Text>{(value as FieldValue | undefined)?.unpack()?.toString()}</Text>
  }
})
