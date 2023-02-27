import type { IQueryRecords, ReferenceFieldTypes } from '@egodb/core'
import { useGetRecordQuery } from '@egodb/store'
import type { SelectItem } from '@egodb/ui'
import { isEmpty } from '@fxts/core'
import { unionBy } from 'lodash'
import { useCurrentTable } from './use-current-table'

export const useReferenceDisplayValues = (
  field: ReferenceFieldTypes,
  recordId: string,
  foreignRecords: IQueryRecords,
) => {
  const table = useCurrentTable()
  const displayFields = field.displayFieldIds.map((f) => f.value)

  const { data: record } = useGetRecordQuery({ tableId: table.id.value, id: recordId }, { skip: !recordId })

  let data: SelectItem[] = []
  if (record) {
    const foreignRecordIds = record.values[field.id.value]
    if (Array.isArray(foreignRecordIds) && !isEmpty(foreignRecordIds)) {
      const values = field.getDisplayValues(record.displayValues)
      for (const [index, foreignRecordId] of foreignRecordIds.entries()) {
        data.push({ value: foreignRecordId as string, label: values[index]?.filter(Boolean).toString() || 'Unnamed' })
      }
    }
  }
  for (const foreignRecord of foreignRecords) {
    const values = displayFields.map((fieldId) => foreignRecord.values[fieldId]?.toString())
    data = unionBy(data, [{ value: foreignRecord.id, label: values.filter(Boolean).toString() || 'Unnamed' }], 'value')
  }

  return data
}
