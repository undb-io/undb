import type { ICreateTableInput } from '@undb/cqrs'
import { RATING_MAX, RATING_MAX_DEFAULT, canDisplay } from '@undb/core'
import { NumberInput, Switch, TextInput } from '@undb/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldInputLabel } from '../../field-inputs/field-input-label'
import { ForeignFieldsPicker } from '../../field-inputs/foreign-fields-picker'
import { SelectFieldControl } from '../../field-inputs/select-field-control'
import { TablePicker } from '../../table/table-picker'
import type { FieldBase } from '../../field-inputs/field-picker.type'
import { DateFormatPicker } from '../../field/date-format-picker'
import { useTranslation } from 'react-i18next'
import { FieldPicker } from '../../field-inputs/field-picker'
import { CustomDisplayFieldsPicker } from '../../field-inputs/custom-display-fields-picker'

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
    const foreignTableId = form.watch(`schema.${index}.foreignTableId`)
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
        {type === 'reference' && !!foreignTableId && (
          <Switch label={t('Bidirectional')} {...form.register(`schema.${index}.bidirectional`)} />
        )}

        <Controller
          name={`schema.${index}.displayFieldIds`}
          render={(props) =>
            type === 'reference' ? (
              <CustomDisplayFieldsPicker
                fields={schema.filter((schema) => canDisplay(schema.type)) as FieldBase[]}
                foreignTableId={form.watch(`schema.${index}.foreignTableId`)}
                {...props.field}
                onChange={(ids) => props.field.onChange(ids)}
                fieldFilter={(f) => f.isPrimitive()}
                placeholder={t('Select Display Fields') as string}
                label={<FieldInputLabel>{t('Display Fields')}</FieldInputLabel>}
              />
            ) : (
              <ForeignFieldsPicker
                fields={schema.filter((schema) => canDisplay(schema.type)) as FieldBase[]}
                foreignTableId={form.watch(`schema.${index}.foreignTableId`)}
                {...props.field}
                onChange={(ids) => props.field.onChange(ids)}
                fieldFilter={(f) => f.isPrimitive()}
                placeholder={t('Select Display Fields') as string}
                label={<FieldInputLabel>{t('Display Fields')}</FieldInputLabel>}
              />
            )
          }
        />
      </>
    )
  }

  if (type === 'count' || type === 'sum' || type === 'lookup' || type === 'average') {
    const schema = form.watch('schema')
    // const referenceFieldId = form.watch(`schema.${index}.referenceFieldId`)

    return (
      <>
        <Controller
          name={`schema.${index}.referenceFieldId`}
          render={(props) => (
            <FieldPicker
              variant="filled"
              label={<FieldInputLabel>{t('Reference Field')}</FieldInputLabel>}
              fields={
                schema
                  .filter((f) => f.type === 'reference')
                  .map((f) => ({ id: f.id, type: f.type, name: f.name })) as FieldBase[]
              }
              {...props.field}
              placeholder={t('Select Reference Field') as string}
              withinPortal
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
