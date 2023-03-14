import type { ICreateTableInput } from '@egodb/cqrs'
import { RATING_MAX, RATING_MAX_DEFAULT } from '@egodb/core'
import { NumberInput, TextInput } from '@egodb/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldInputLabel } from '../../field-inputs/field-input-label'
import { DisplayFieldsPicker } from '../../field-inputs/display-fields-picker'
import { SelectFieldControl } from '../../field-inputs/select-field-control'
import { TablePicker } from '../../table/table-picker'
import type { FieldBase } from '../../field-inputs/field-picker.type'
import { DateFormatPicker } from '../../field/date-format-picker'
import { useTranslation } from 'react-i18next'

interface IProps {
  index: number
}

export const FieldVariantControl: React.FC<IProps> = ({ index }) => {
  const form = useFormContext<ICreateTableInput>()
  const type = form.watch(`schema.${index}.type`)

  const { t } = useTranslation()

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
            placeholder="set rating max..."
            label={<FieldInputLabel>{t('Max', { ns: 'common' })}</FieldInputLabel>}
          />
        )}
      />
    )
  }

  if (type === 'select') {
    return <Controller name={`schema.${index}.options`} render={(props) => <SelectFieldControl {...props.field} />} />
  }

  if (type === 'tree' || type === 'reference') {
    const schema = form.watch('schema')
    return (
      <>
        {type === 'tree' && (
          <Controller
            name={`schema.${index}.parentFieldName`}
            render={(props) => (
              <TextInput
                label={<FieldInputLabel>{t('Parent Field Name')}</FieldInputLabel>}
                {...props.field}
                variant="filled"
                value={props.field.value ?? ''}
                placeholder={t('Set Parent Field Name') as string}
              />
            )}
          />
        )}
        {type === 'reference' && (
          <Controller
            name={`schema.${index}.foreignTableId`}
            render={(props) => (
              <TablePicker
                {...props.field}
                onChange={(tableId) => props.field.onChange(tableId)}
                variant="filled"
                placeholder={t('Select Foreign Table') as string}
              />
            )}
          />
        )}
        <Controller
          name={`schema.${index}.displayFieldIds`}
          render={(props) => (
            <DisplayFieldsPicker
              fields={schema as FieldBase[]}
              tableId={form.watch(`schema.${index}.foreignTableId`)}
              {...props.field}
              onChange={(ids) => props.field.onChange(ids)}
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
        render={(props) => (
          <DateFormatPicker {...props.field} variant="filled" placeholder={t('Select Date Format') as string} />
        )}
      />
    )
  }

  return null
}
