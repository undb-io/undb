import { useSwitchDisplayTypeMutation } from '@undb/store'
import { useCurrentView } from '../../hooks/use-current-view'
import { useFixedCacheKey } from '../../hooks/use-fixed-cache-key'
import { CalendarUI } from '../calendar-ui/calendar-ui'
import { KanbanUI } from '../kanban-ui/kanban-ui'
import { TableUI } from '../table-ui/table-ui'
import { TreeViewUI } from '../tree-view-ui/tree-view-ui'
import { LoadingOverlay, useDebouncedValue } from '@undb/ui'

export const ViewDisplay: React.FC = () => {
  const view = useCurrentView()
  const displayType = view.displayType

  const cacheKey = useFixedCacheKey()

  const [, { isLoading }] = useSwitchDisplayTypeMutation({
    fixedCacheKey: cacheKey,
  })
  const [debouncedLoading] = useDebouncedValue(isLoading, 200)

  if (displayType === 'kanban') {
    return (
      <>
        <LoadingOverlay visible={debouncedLoading} />
        <KanbanUI />
      </>
    )
  }

  if (displayType === 'calendar') {
    return (
      <>
        <LoadingOverlay visible={debouncedLoading} />
        <CalendarUI />{' '}
      </>
    )
  }

  if (displayType === 'tree') {
    return (
      <>
        <LoadingOverlay visible={debouncedLoading} />
        <TreeViewUI />
      </>
    )
  }

  return (
    <>
      <LoadingOverlay visible={debouncedLoading} />
      <TableUI />
    </>
  )
}
