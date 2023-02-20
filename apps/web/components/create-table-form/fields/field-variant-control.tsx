import type { ICreateTableInput } from '@egodb/cqrs'
import { RATING_MAX, RATING_MAX_DEFAULT } from '@egodb/core'
import { NumberInput, TextInput } from '@egodb/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldInputLabel } from '../../field-inputs/field-input-label'
import type { FieldBase } from '../../field-inputs/field-picker.type'
import { FieldsPicker } from '../../field-inputs/fields-picker'
import { SelectFieldControl } from '../../field-inputs/select-field-control'
import { useCurrentTable } from '../../../hooks/use-current-table'

interface IProps {
  index: number
}

export const FieldVariantControl: React.FC<IProps> = ({ index }) => {
  const table = useCurrentTable()
  const form = useFormContext<ICreateTableInput>()
  const type = form.watch(`schema.${index}.type`)
  const id = form.watch(`schema.${index}.id`)
  const fields = form.watch('schema')

  if (type === 'rating') {
    return (
      <Controller
        name={`schema.${index}.max`}
        render={(props) => (
          <NumberInput
            {...props.field}
            variant="filled"
            defaultValue={RATING_MAX_DEFAULT}
            max={RATING_MAX}
            onChange={(number) => props.field.onChange(number)}
          />
        )}
      />
    )
  }

  const treeFields = fields.filter((f) => f.id !== id)
  if (type === 'select') {
    return (
      <Controller
        name={`schema.${index}.options`}
        render={(props) => <SelectFieldControl onChange={(options) => props.field.onChange(options)} />}
      />
    )
  }
  if (type === 'tree') {
    return (
      <>
        <Controller
          name={`schema.${index}.parentFieldName`}
          render={(props) => (
            <TextInput
              label={<FieldInputLabel>parent field name</FieldInputLabel>}
              {...props.field}
              variant="filled"
              value={props.field.value ?? ''}
            />
          )}
        />
        <Controller
          name={`schema.${index}.displayFieldIds`}
          render={(props) => (
            <FieldsPicker
              tableId={table.id.value}
              fields={treeFields as FieldBase[]}
              {...props.field}
              onChange={(ids) => props.field.onChange(ids)}
            />
          )}
        />
      </>
    )
  }

  return null
}
