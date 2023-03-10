import { useMemo } from 'react'
import { useCurrentTable } from './use-current-table'
import { useCurrentView } from './use-current-view'

export const useOrderedFields = () => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const schema = table.schema.toIdMap()

  const fieldsOrder = table.getFieldsOrder(view)

  const fields = useMemo(() => fieldsOrder.map((fieldId) => schema.get(fieldId)).filter(Boolean), [fieldsOrder, schema])

  return fields
}
