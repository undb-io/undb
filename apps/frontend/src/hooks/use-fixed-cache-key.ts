import { useCurrentTable } from './use-current-table'
import { useCurrentView } from './use-current-view'

export const useFixedCacheKey = () => {
  const table = useCurrentTable()
  const view = useCurrentView()

  return `${table.id.value}_${view.id.value}`
}
