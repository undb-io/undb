import type { Field, IOperator } from '@undb/core'
import { AutoIncrementField } from '@undb/core'
import { AttachmentField } from '@undb/core'
import { AverageField, SumField } from '@undb/core'
import { CountField } from '@undb/core'
import { ColorField } from '@undb/core'
import { EmailField } from '@undb/core'
import { RatingField } from '@undb/core'
import { IdField } from '@undb/core'
import { CreatedAtField, UpdatedAtField } from '@undb/core'
import { TreeField } from '@undb/core'
import { DateRangeField } from '@undb/core'
import { SelectField } from '@undb/core'
import { StringField } from '@undb/core'
import { BoolField } from '@undb/core'
import { DateField } from '@undb/core'
import { NumberField } from '@undb/core'
import type { SelectItem } from '@undb/ui'
import { Select } from '@undb/ui'
import { useTranslation } from 'react-i18next'

interface IProps {
  field: Field | null
  value: IOperator | null
  onChange: (operator: IOperator | null) => void
}

export const OperatorSelector: React.FC<IProps> = ({ value, field, onChange }) => {
  let data: SelectItem[] = []

  const { t } = useTranslation()

  // TODO: optimize if else
  if (field instanceof StringField) {
    data = [
      { value: '$eq', label: t('EQUAL', { ns: 'common' }) as string },
      { value: '$neq', label: t('NOT EQUAL', { ns: 'common' }) as string },
      { value: '$contains', label: t('CONTAINS', { ns: 'common' }) as string },
      { value: '$starts_with', label: t('STARTS WITH', { ns: 'common' }) as string },
      { value: '$ends_with', label: t('ENDS WITH', { ns: 'common' }) as string },
      // { value: '$regex', label: t('REGEX', { ns: 'common' }) as string },
    ]
  } else if (field instanceof EmailField) {
    data = [
      { value: '$eq', label: t('EQUAL', { ns: 'common' }) as string },
      { value: '$neq', label: t('NOT EQUAL', { ns: 'common' }) as string },
      { value: '$contains', label: t('CONTAINS', { ns: 'common' }) as string },
      { value: '$starts_with', label: t('STARTS WITH', { ns: 'common' }) as string },
      { value: '$ends_with', label: t('ENDS WITH', { ns: 'common' }) as string },
    ]
  } else if (field instanceof ColorField) {
    data = [
      { value: '$eq', label: t('EQUAL', { ns: 'common' }) as string },
      { value: '$neq', label: t('NOT EQUAL', { ns: 'common' }) as string },
    ]
  } else if (
    field instanceof NumberField ||
    field instanceof RatingField ||
    field instanceof CountField ||
    field instanceof SumField ||
    field instanceof AverageField ||
    field instanceof AutoIncrementField
  ) {
    data = [
      { value: '$eq', label: t('EQUAL', { ns: 'common' }) as string },
      { value: '$neq', label: t('NOT EQUAL', { ns: 'common' }) as string },
      { value: '$gt', label: t('GREATER THAN', { ns: 'common' }) as string },
      { value: '$gte', label: t('GREATER THAN OR EQUAL', { ns: 'common' }) as string },
      { value: '$lt', label: t('LESS THAN', { ns: 'common' }) as string },
      { value: '$lte', label: t('LESS THAN OR EQUAL', { ns: 'common' }) as string },
    ]
  } else if (field instanceof AttachmentField) {
    data = [
      { value: '$is_empty', label: t('IS EMPTY', { ns: 'common' }) as string },
      { value: '$is_not_empty', label: t('IS NOT EMPTY', { ns: 'common' }) as string },
      { value: '$has_file_type', label: t('HAS FILE TYPE', { ns: 'common' }) as string },
      { value: '$has_file_extension', label: t('HAS FILE EXTENSION', { ns: 'common' }) as string },
    ]
  } else if (field instanceof DateField || field instanceof CreatedAtField || field instanceof UpdatedAtField) {
    data = [
      { value: '$eq', label: t('EQUAL', { ns: 'common' }) as string },
      { value: '$neq', label: t('NOT EQUAL', { ns: 'common' }) as string },
      { value: '$gt', label: t('GREATER THAN', { ns: 'common' }) as string },
      { value: '$gte', label: t('GREATER THAN OR EQUAL', { ns: 'common' }) as string },
      { value: '$lt', label: t('LESS THAN', { ns: 'common' }) as string },
      { value: '$lte', label: t('LESS THAN OR EQUAL', { ns: 'common' }) as string },
      { value: '$is_today', label: t('IS TODAY', { ns: 'common' }) as string },
    ]
  } else if (field instanceof DateRangeField) {
    data = [
      { value: '$eq', label: t('EQUAL', { ns: 'common' }) as string },
      { value: '$neq', label: t('NOT EQUAL', { ns: 'common' }) as string },
    ]
  } else if (field instanceof BoolField) {
    data = [
      { value: '$is_true', label: t('IS TRUE', { ns: 'common' }) as string },
      { value: '$is_false', label: t('IS FALSE', { ns: 'common' }) as string },
    ]
  } else if (field instanceof SelectField) {
    data = [
      { value: '$eq', label: t('EQUAL', { ns: 'common' }) as string },
      { value: '$neq', label: t('NOT EQUAL', { ns: 'common' }) as string },
      { value: '$in', label: t('IN', { ns: 'common' }) as string },
      { value: '$nin', label: t('NOT IN', { ns: 'common' }) as string },
    ]
  } else if (field instanceof TreeField) {
    data = [{ value: '$is_root', label: t('IS ROOT', { ns: 'common' }) as string }]
  } else if (field instanceof IdField) {
    data = [
      { value: '$eq', label: t('EQUAL', { ns: 'common' }) as string },
      { value: '$neq', label: t('NOT EQUAL', { ns: 'common' }) as string },
      { value: '$in', label: t('IN', { ns: 'common' }) as string },
      { value: '$nin', label: t('NOT IN', { ns: 'common' }) as string },
    ]
  }

  return (
    <Select
      size="xs"
      variant="filled"
      value={value}
      disabled={!field}
      data={data}
      onChange={(value) => onChange(value as IOperator | null)}
      withinPortal
    />
  )
}
