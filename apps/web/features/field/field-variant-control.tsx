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
import { useTranslation } from 'react-i18next'

interface IProps {
  isNew: boolean
}

export const FieldVariantControl: React.FC<IProps> = ({ isNew = false }) => {
  const table = useNullableCurrentTable()

  const { t } = useTranslation()

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
            label={<FieldInputLabel>{t('Max', { ns: 'common' })}</FieldInputLabel>}
            defaultValue={RATING_MAX_DEFAULT}
            max={RATING_MAX}
            placeholder={t('Set Rating Max') as string}
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
                label={<FieldInputLabel>{t('Parent Field Name')}</FieldInputLabel>}
                {...props.field}
                value={props.field.value ?? ''}
                placeholder={t('Set Parent Field Name') as string}
              />
            )}
          />
        )}
        {type === 'reference' && (
          <Controller
            name="foreignTableId"
            render={(props) => <TablePicker {...props.field} placeholder={t('Select Foreign Table') as string} />}
          />
        )}
        <Controller
          name="displayFieldIds"
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
        render={(props) => (
          <DateFormatPicker {...props.field} variant="default" placeholder={t('Select Date Format') as string} />
        )}
      />
    )
  }

  return null
}
