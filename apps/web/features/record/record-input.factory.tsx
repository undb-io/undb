import type { Field } from '@egodb/core'
import {
  NumberInput,
  DatePickerInput,
  Checkbox,
  TextInput,
  ColorInput,
  Rating,
  IconExternalLink,
  ActionIcon,
  Center,
  IconCopy,
  useClipboard,
  IconClipboardCheck,
} from '@egodb/ui'
import React from 'react'
import { Controller } from 'react-hook-form'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { TreeRecordsPicker } from '../field-inputs/tree-records-picker'
import { OptionPicker } from '../option/option-picker'
import { ReferenceRecordPicker } from '../field-inputs/reference-record-picker'
import { FieldIcon } from '../field-inputs/field-Icon'
import { ParentRecordPicker } from '../field-inputs/parent-records-picker'
import { useRouter } from 'next/navigation'
import { useColors } from '../../hooks/use-colors'
import { AutoIncrementInput } from '../field-inputs/auto-increment-input'
import { format } from 'date-fns'

interface IProps {
  field: Field
  name: string
}

export const RecordInputFactory: React.FC<IProps> = ({ name, field }) => {
  const { copy, copied } = useClipboard({ timeout: 1500 })
  const router = useRouter()
  const colors = useColors()

  const label = <FieldInputLabel>{field.name.value}</FieldInputLabel>
  const desciption = field.description?.value
  const required = field.required
  if (field.type === 'number') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <NumberInput
            {...form.field}
            icon={<FieldIcon type={field.type} />}
            label={label}
            placeholder={desciption}
            onChange={(number) => form.field.onChange(number)}
            required={required}
            error={form.fieldState.error?.message}
          />
        )}
      />
    )
  }
  if (field.type === 'rating') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <>
            <FieldInputLabel>{field.name.value}</FieldInputLabel>
            <Rating
              {...form.field}
              count={field.max}
              onChange={(number) => form.field.onChange(number)}
              placeholder={desciption}
            />
          </>
        )}
      />
    )
  }
  if (field.type === 'color') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <ColorInput
            {...form.field}
            icon={<FieldIcon type={field.type} color={form.field.value ?? 'gray'} />}
            label={label}
            onChange={(color) => form.field.onChange(color)}
            value={form.field.value ?? ''}
            swatches={colors}
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
            withinPortal
          />
        )}
      />
    )
  }
  if (field.type === 'date') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <DatePickerInput
            label={label}
            icon={<FieldIcon type={field.type} />}
            {...form.field}
            value={form.field.value ? new Date(form.field.value) : undefined}
            onChange={(date) => form.field.onChange(date?.toISOString())}
            valueFormat={field.formatString.toUpperCase()}
            popoverProps={{ withinPortal: true }}
            clearable
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
          />
        )}
      />
    )
  }
  if (field.type === 'date-range') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <DatePickerInput
            type="range"
            label={label}
            {...form.field}
            clearable
            icon={<FieldIcon type={field.type} />}
            value={
              form.field.value
                ? [
                    form.field.value.at(0) ? new Date(form.field.value.at(0)) : null,
                    form.field.value.at(1) ? new Date(form.field.value.at(1)) : null,
                  ]
                : [null, null]
            }
            onChange={(value) =>
              form.field.onChange(value ? [value.at(0)?.toISOString() ?? null, value.at(1)?.toISOString()] : null)
            }
            valueFormat={field.formatString.toUpperCase()}
            popoverProps={{ withinPortal: true }}
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
          />
        )}
      />
    )
  }
  if (field.type === 'bool') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <Checkbox
            lh={1}
            key={field.id.value}
            {...form.field}
            checked={form.field.value}
            label={label}
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
          />
        )}
      />
    )
  }
  if (field.type === 'select') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <OptionPicker
            field={field}
            icon={<FieldIcon type={field.type} />}
            label={label}
            {...form.field}
            onChange={(value) => form.field.onChange(value)}
            value={form.field.value ?? ''}
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
            withinPortal
          />
        )}
      />
    )
  }

  if (field.type === 'reference') {
    const foreignTable = field.foreignTableId
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <ReferenceRecordPicker
            field={field}
            label={
              <Center>
                {label}
                <ActionIcon
                  ml="xs"
                  size="xs"
                  onClick={() => {
                    if (foreignTable.isSome()) {
                      router.push(`/t/${foreignTable.unwrap()}`)
                    }
                  }}
                >
                  <IconExternalLink size={14} />
                </ActionIcon>
              </Center>
            }
            {...form.field}
            onChange={(value) => form.field.onChange(value)}
            value={form.field.value ?? []}
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
            withinPortal
          />
        )}
      />
    )
  }

  if (field.type === 'tree') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <TreeRecordsPicker
            field={field}
            label={label}
            onChange={(value) => form.field.onChange(value)}
            value={form.field.value ?? []}
            name={form.field.name}
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
            withinPortal
          />
        )}
      />
    )
  }

  if (field.type === 'parent') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <ParentRecordPicker
            field={field}
            label={label}
            onChange={(value) => form.field.onChange(value)}
            value={form.field.value ?? ''}
            name={form.field.name}
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
            withinPortal
          />
        )}
      />
    )
  }
  if (field.type === 'id') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <TextInput
            data-auto-focus
            disabled
            icon={<FieldIcon type={field.type} />}
            label={label}
            {...form.field}
            value={form.field.value ?? ''}
            rightSection={
              copied ? (
                <IconClipboardCheck size={14} color="green" />
              ) : (
                <IconCopy size={14} color="gray" onClick={() => copy(form.field.value)} />
              )
            }
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
          />
        )}
      />
    )
  }
  if (field.type === 'created-at' || field.type === 'updated-at') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => {
          return (
            <TextInput
              data-auto-focus
              disabled
              icon={<FieldIcon type={field.type} />}
              label={label}
              {...form.field}
              value={form.field.value ? format(new Date(form.field.value), field.formatString) : ''}
              placeholder={desciption}
              required={required}
              error={form.fieldState.error?.message}
            />
          )
        }}
      />
    )
  }

  if (field.type === 'auto-increment') {
    return (
      <Controller
        name={name}
        rules={{ required: field.required }}
        render={(form) => (
          <AutoIncrementInput
            field={field}
            defaultValue={form.field.value}
            placeholder={desciption}
            required={required}
            error={form.fieldState.error?.message}
          />
        )}
      />
    )
  }

  return (
    <Controller
      name={name}
      rules={{ required: field.required }}
      render={(form) => (
        <TextInput
          data-auto-focus
          disabled={field.system || field.controlled}
          icon={<FieldIcon type={field.type} />}
          label={label}
          {...form.field}
          value={form.field.value ?? ''}
          placeholder={desciption}
          required={required}
          error={form.fieldState.error?.message}
          readOnly={field.controlled}
        />
      )}
    />
  )
}
