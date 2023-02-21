import type { ICreateFieldSchema, IUpdateFieldSchema } from '@egodb/core'
import { RATING_MAX, RATING_MAX_DEFAULT } from '@egodb/core'
import { NumberInput, TextInput } from '@egodb/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { DisplayFieldsPicker } from '../field-inputs/display-fields-picker'
import { SelectFieldControl } from '../field-inputs/select-field-control'
import { TablePicker } from '../table/table-picker'

interface IProps {
  isNew: boolean
}

export const FieldVariantControl: React.FC<IProps> = ({ isNew = false }) => {
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
            onChange={(number) => props.field.onChange(number)}
          />
        )}
      />
    )
  }
  if (type === 'select') {
    return (
      <Controller
        name="options"
        render={(props) => <SelectFieldControl onChange={(options) => props.field.onChange(options)} />}
      />
    )
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
              />
            )}
          />
        )}
        {type === 'reference' && (
          <Controller
            name="foreignTableId"
            render={(props) => <TablePicker {...props.field} onChange={(tableId) => props.field.onChange(tableId)} />}
          />
        )}
        <Controller
          name={'displayFieldIds'}
          render={(props) => (
            <DisplayFieldsPicker
              tableId={form.watch('foreignTableId')}
              {...props.field}
              onChange={(ids) => props.field.onChange(ids)}
              variant="default"
            />
          )}
        />
      </>
    )
  }
  return null
}
