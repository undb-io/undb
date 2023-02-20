import type { ICreateFieldSchema, IUpdateFieldSchema } from '@egodb/core'
import { RATING_MAX, RATING_MAX_DEFAULT } from '@egodb/core'
import { NumberInput, TextInput } from '@egodb/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { useCurrentTable } from '../../hooks/use-current-table'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import type { FieldBase } from '../field-inputs/field-picker.type'
import { FieldsPicker } from '../field-inputs/fields-picker'
import { SelectFieldControl } from '../field-inputs/select-field-control'
import { TablePicker } from '../table/table-picker'

interface IProps {
  isNew: boolean
}

export const FieldVariantControl: React.FC<IProps> = ({ isNew = false }) => {
  const table = useCurrentTable()

  type FormValues = typeof isNew extends 'true' ? ICreateFieldSchema : IUpdateFieldSchema
  const form = useFormContext<FormValues>()
  const type = form.watch('type')
  const fields: FieldBase[] = table.schema.nonSystemFields.map((f) => ({
    id: f.id.value,
    name: f.name.value,
    type: f.type,
  }))

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
            <FieldsPicker
              tableId={form.getValues('foreignTableId')}
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
