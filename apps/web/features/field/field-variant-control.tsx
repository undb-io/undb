import type { ICreateFieldSchema, IUpdateFieldSchema } from '@egodb/core'
import { RATING_MAX, RATING_MAX_DEFAULT } from '@egodb/core'
import { NumberInput, TextInput } from '@egodb/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { DisplayFieldsPicker } from '../field-inputs/display-fields-picker'
import { SelectFieldControl } from '../field-inputs/select-field-control'
import { TablePicker } from '../table/table-picker'
import { useNullableCurrentTable } from '../../hooks/use-current-table'
import { DateFormatPicker } from './date-format-picker'

interface IProps {
  isNew: boolean
}

export const FieldVariantControl: React.FC<IProps> = ({ isNew = false }) => {
  const table = useNullableCurrentTable()

  type FormValues = typeof isNew extends 'true' ? ICreateFieldSchema : IUpdateFieldSchema
  const form = useFormContext<FormValues>()
  const type = form.watch('type')

  if (type === 'rating') {
    return (
      <Controller
        name="max"
        render={(props) => (
          <NumberInput
            {...props.field}
            defaultValue={RATING_MAX_DEFAULT}
            max={RATING_MAX}
            placeholder="set rating max..."
            onChange={(number) => props.field.onChange(number)}
          />
        )}
      />
    )
  }
  if (type === 'select') {
    return <Controller name="options" render={(props) => <SelectFieldControl {...props.field} />} />
  }

  if (type === 'tree' || type === 'reference' || type === 'parent') {
    return (
      <>
        {isNew && type === 'tree' && (
          <Controller
            name="parentFieldName"
            render={(props) => (
              <TextInput
                label={<FieldInputLabel>parent field name</FieldInputLabel>}
                {...props.field}
                value={props.field.value ?? ''}
                placeholder="set tree field parent field name"
              />
            )}
          />
        )}
        {type === 'reference' && (
          <Controller
            name="foreignTableId"
            render={(props) => <TablePicker {...props.field} placeholder="select foreign table" />}
          />
        )}
        <Controller
          name={'displayFieldIds'}
          render={(props) => (
            <DisplayFieldsPicker
              tableId={form.watch('foreignTableId') ?? table?.id.value}
              {...props.field}
              onChange={(ids) => props.field.onChange(ids)}
              variant="default"
            />
          )}
        />
      </>
    )
  }

  if (type === 'date' || type === 'date-range' || type === 'created-at' || type === 'updated-at') {
    return (
      <Controller
        name="format"
        render={(props) => <DateFormatPicker {...props.field} variant="default" placeholder="select date format" />}
      />
    )
  }

  return null
}
