import type {
  AttachmentFieldValue,
  BoolFieldValue,
  CollaboratorFieldValue,
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
} from '@undb/core'
import React from 'react'
import { ReferenceValue } from './reference-value'
import { BoolValue } from './bool-value'
import { DateRangeValue } from './date-range-value'
import { DateValue } from './date-value'
import { RecordId } from './record-id'
import { AspectRatio, Divider, Group, Rating, Text } from '@undb/ui'
import type { FieldValue } from '@undb/core'
import { Option } from '../option/option'
import { ColorValue } from './color-value'
import type { IRecordDisplayValues } from '@undb/core'
import { isNumber } from 'lodash-es'
import { AttachmentValue } from './attachment-value'
import { CollaboratorValue } from './collaborator-value'

export const FieldValueFactory: React.FC<{
  field: Field
  value: RecordAllValueType
  displayValues?: IRecordDisplayValues
}> = ({ field, value, displayValues }) => {
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
    case 'collaborator': {
      const userIds = (value as CollaboratorFieldValue | undefined)?.unpack()
      if (!userIds) return null
      const values = field.getDisplayValues(displayValues)

      return (
        <Group spacing={3} noWrap sx={{ overflow: 'hidden' }} h="100%">
          {values.map((value, index) => (
            <CollaboratorValue key={index} values={value} />
          ))}
        </Group>
      )
    }
    case 'reference':
    case 'tree': {
      const unpacked = (value as ReferenceFieldValue | TreeFieldValue | undefined)?.unpack()
      if (!unpacked) return null
      const values = field.getDisplayValues(displayValues)

      if (unpacked?.length && !values?.length) {
        return (
          <Group spacing={3} noWrap sx={{ overflow: 'hidden' }} h="100%">
            {unpacked.map((_, index) => (
              <ReferenceValue key={index} />
            ))}
          </Group>
        )
      }

      return (
        <Group spacing={3} noWrap sx={{ overflow: 'hidden' }} align="center" h="100%">
          {values.map((value, index) => (
            <ReferenceValue key={index} values={value} />
          ))}
        </Group>
      )
    }

    case 'attachment': {
      const unpacked = (value as AttachmentFieldValue | undefined)?.unpack()
      if (!unpacked?.length) return null

      return (
        <Group h="100%" noWrap>
          {unpacked.map((value) => (
            <AspectRatio key={value.id} ratio={1} h="100%" w="20px">
              <AttachmentValue attachment={value} />
            </AspectRatio>
          ))}
        </Group>
      )
    }

    case 'lookup': {
      const values = field.getDisplayValues(displayValues)

      return (
        <Group spacing={3} noWrap sx={{ overflow: 'hidden' }} h="100%">
          {values.filter(Boolean).map((value, index) => (
            <>
              {index === 0 ? null : <Divider orientation="vertical" mx={5} size="xs" />}
              <Text key={index}>{value.filter(Boolean).toString()}</Text>
            </>
          ))}
        </Group>
      )
    }

    default:
      return <span>{(value as FieldValue | undefined)?.unpack()?.toString()}</span>
  }
}
