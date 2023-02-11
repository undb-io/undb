import type { Field } from '@egodb/core'
import type { Table } from '@egodb/core'
import { NumberInput, DatePicker, DateRangePicker, Checkbox, TextInput, ColorInput, Rating } from '@egodb/ui'
import React from 'react'
import { Controller } from 'react-hook-form'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { TreeRecordsPicker } from '../field-inputs/tree-records-picker'
import { OptionPicker } from '../option/option-picker'
import { ReferenceRecordPicker } from '../field-inputs/reference-record-picker'
import { FieldIcon } from '../field-inputs/field-Icon'
import { ParentRecordPicker } from '../field-inputs/parent-records-picker'

interface IProps {
  table: Table
  field: Field
  name: string
  recordId?: string
}

export const RecordInputFactory: React.FC<IProps> = ({ table, name, field, recordId }) => {
  const label = <FieldInputLabel>{field.name.value}</FieldInputLabel>
  if (field.type === 'number') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <NumberInput
            {...form.field}
            icon={<FieldIcon type={field.type} />}
            label={label}
            onChange={(number) => form.field.onChange(number)}
          />
        )}
      />
    )
  }
  if (field.type === 'rating') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <>
            <FieldInputLabel>{field.name.value}</FieldInputLabel>
            <Rating {...form.field} onChange={(number) => form.field.onChange(number)} />
          </>
        )}
      />
    )
  }
  if (field.type === 'color') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <ColorInput
            {...form.field}
            icon={<FieldIcon type={field.type} color={form.field.value ?? 'gray'} />}
            label={label}
            onChange={(color) => form.field.onChange(color)}
            value={form.field.value ?? ''}
          />
        )}
      />
    )
  }
  if (field.type === 'date') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <DatePicker
            allowFreeInput
            inputFormat="YYYY-MM-DD"
            labelFormat="YYYY-MM-DD"
            label={label}
            icon={<FieldIcon type={field.type} />}
            {...form.field}
            onChange={(date) => form.field.onChange(date)}
          />
        )}
      />
    )
  }
  if (field.type === 'date-range') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <DateRangePicker
            label={label}
            {...form.field}
            icon={<FieldIcon type={field.type} />}
            value={form.field.value ?? [null, null]}
            onChange={(value) => form.field.onChange(value)}
          />
        )}
      />
    )
  }
  if (field.type === 'bool') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <Checkbox lh={1} key={field.id.value} {...form.field} checked={form.field.value} label={label} />
        )}
      />
    )
  }
  if (field.type === 'select') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <OptionPicker
            field={field}
            icon={<FieldIcon type={field.type} />}
            table={table}
            label={label}
            {...form.field}
            onChange={(value) => form.field.onChange(value)}
            value={form.field.value ?? ''}
          />
        )}
      />
    )
  }

  if (field.type === 'reference') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <ReferenceRecordPicker
            field={field}
            table={table}
            label={label}
            {...form.field}
            onChange={(value) => form.field.onChange(value)}
            value={form.field.value ?? []}
          />
        )}
      />
    )
  }

  if (field.type === 'tree') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <TreeRecordsPicker
            field={field}
            table={table}
            label={label}
            recordId={recordId}
            {...form.field}
            onChange={(value) => form.field.onChange(value)}
            value={form.field.value ?? []}
          />
        )}
      />
    )
  }

  if (field.type === 'parent') {
    return (
      <Controller
        name={name}
        render={(form) => (
          <ParentRecordPicker
            field={field}
            table={table}
            label={label}
            recordId={recordId}
            {...form.field}
            onChange={(value) => form.field.onChange(value)}
            value={form.field.value ?? ''}
          />
        )}
      />
    )
  }

  return (
    <Controller
      name={name}
      render={(form) => {
        return (
          <TextInput
            data-auto-focus
            icon={<FieldIcon type={field.type} />}
            label={label}
            {...form.field}
            value={form.field.value ?? ''}
          />
        )
      }}
    />
  )
}
