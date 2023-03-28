import { useGetTableQuery } from '@egodb/store'
import { DisplayFields } from '../field/display-fields'
import { TableFactory } from '@egodb/core'
import { Stack, Switch } from '@egodb/ui'
import type { IForeignTablePickerProps } from './foreign-fields-picker'
import { ForeignFieldsPicker } from './foreign-fields-picker'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const DisplayFieldsPicker: React.FC<IForeignTablePickerProps> = (props) => {
  const { foreignTableId } = props
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data } = useGetTableQuery({ id: foreignTableId! }, { skip: !foreignTableId })
  const table = useMemo(() => (data ? TableFactory.fromQuery(data) : undefined), [data])
  const displayFields = table?.schema.displayFields?.map((f) => ({ name: f.name.value })) ?? []

  const [custom, setCustom] = useState(!displayFields.length)
  const { t } = useTranslation()

  useLayoutEffect(() => {
    setCustom(!displayFields.length)
  }, [table])

  if (!table) {
    return null
  }

  return (
    <Stack>
      <Switch
        checked={custom}
        onChange={(e) => setCustom(e.target.checked)}
        label={t('Custom Display Fields') as string}
      />
      {!!displayFields.length && !custom && <DisplayFields displayFields={displayFields} />}
      {custom && <ForeignFieldsPicker {...props} />}
    </Stack>
  )
}
