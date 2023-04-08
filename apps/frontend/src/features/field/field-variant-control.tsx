import type { Field, ICreateFieldSchema, IUpdateFieldSchema, ParentField, ReferenceField, TreeField } from '@undb/core'
import { RATING_MAX, RATING_MAX_DEFAULT } from '@undb/core'
import { NumberInput, Switch, TextInput } from '@undb/ui'
import type { UseFormReturn } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import type { IForeignTablePickerProps } from '../field-inputs/foreign-fields-picker'
import { ForeignFieldsPicker } from '../field-inputs/foreign-fields-picker'
import { SelectFieldControl } from '../field-inputs/select-field-control'
import { TablePicker } from '../table/table-picker'
import { useCurrentTable } from '../../hooks/use-current-table'
import { DateFormatPicker } from './date-format-picker'
import { useTranslation } from 'react-i18next'
import { FieldPicker } from '../field-inputs/field-picker'
import { CustomDisplayFieldsPicker } from '../field-inputs/custom-display-fields-picker'

interface IProps {
  isNew: boolean
  field?: Field
}

export const FieldVariantControl: React.FC<IProps> = ({ isNew = false, field }) => {
  const table = useCurrentTable()

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
    const foreignTableId = isNew
      ? (form as UseFormReturn<ICreateFieldSchema>).watch('foreignTableId')
      : (field as TreeField | ReferenceField | ParentField).foreignTableId.into()
    const foreignFieldPickerProps: IForeignTablePickerProps = {
      foreignTableId: foreignTableId ?? table.id.value,
      disabled: type === 'reference' && !foreignTableId,
      variant: 'default',
      fieldFilter: (f) => f.isPrimitive(),
      placeholder: t('Select Display Fields') as string,
      label: <FieldInputLabel>{t('Display Fields')}</FieldInputLabel>,
      value: form.watch('displayFieldIds'),
    }
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
            render={(props) => (
              <TablePicker
                disabled={!isNew}
                {...props.field}
                value={isNew ? props.field.value : foreignTableId}
                placeholder={t('Select Foreign Table') as string}
              />
            )}
          />
        )}
        {isNew && type === 'reference' && !!foreignTableId && foreignTableId !== table.id.value && (
          <Switch
            label={t('Bidirectional')}
            {...(form as UseFormReturn<ICreateFieldSchema>).register('bidirectional')}
          />
        )}
        <Controller
          name="displayFieldIds"
          render={(props) =>
            isNew ? (
              <CustomDisplayFieldsPicker {...props.field} {...foreignFieldPickerProps} />
            ) : (
              <ForeignFieldsPicker {...props.field} {...foreignFieldPickerProps} />
            )
          }
        />
      </>
    )
  }

  if (type === 'count' || type === 'sum' || type === 'average' || type === 'lookup') {
    const schema = table.schema.toIdMap()
    const referenceFieldId = form.watch('referenceFieldId')
    const foreignTableId = referenceFieldId
      ? (schema.get(referenceFieldId) as ReferenceField | TreeField | undefined)?.foreignTableId.into() ??
        table.id.value
      : undefined
    return (
      <>
        <Controller
          name="referenceFieldId"
          render={(props) => (
            <FieldPicker
              label={<FieldInputLabel>{t('Reference Field')}</FieldInputLabel>}
              fields={
                table?.schema.fields
                  .filter((f) => f.type === 'reference' || f.type === 'tree' || f.type === 'parent')
                  .map((f) => ({ id: f.id.value, type: f.type, name: f.name.value })) ?? []
              }
              {...props.field}
              placeholder={t('Select Reference Field') as string}
              withinPortal
            />
          )}
        />
        {type === 'lookup' && (
          <Controller
            name="displayFieldIds"
            render={(props) => (
              <ForeignFieldsPicker
                {...props.field}
                foreignTableId={foreignTableId}
                onChange={(ids) => props.field.onChange(ids)}
                variant="default"
                fieldFilter={(f) => f.isPrimitive()}
                disabled={!referenceFieldId || !foreignTableId}
                placeholder={t('Select Display Fields') as string}
                label={<FieldInputLabel>{t('Display Fields')}</FieldInputLabel>}
              />
            )}
          />
        )}
        {(type === 'sum' || type === 'average') && (
          <Controller
            name="aggregateFieldId"
            render={(props) => {
              return (
                <ForeignFieldsPicker
                  {...props.field}
                  value={props.field.value ? [props.field.value] : []}
                  onChange={(ids) => props.field.onChange(ids[0])}
                  foreignTableId={foreignTableId}
                  variant="default"
                  disabled={!referenceFieldId}
                  placeholder={t('Select Aggregate Field') as string}
                  label={<FieldInputLabel>{t('Aggregate Field')}</FieldInputLabel>}
                  fieldFilter={(f) => f.isNumeric && !f.isAggregate}
                  multiple={false}
                />
              )
            }}
          />
        )}
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
