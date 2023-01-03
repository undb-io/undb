import type { IViewDisplayType } from '@egodb/core'
import { IconCalendar, IconLayoutKanban, IconTable } from '@egodb/ui'

export const DisplayTypeIcon: React.FC<{ displayType: IViewDisplayType }> = ({ displayType }) => {
  switch (displayType) {
    case 'grid':
      return <IconTable />
    case 'kanban':
      return <IconLayoutKanban />
    case 'calendar':
      return <IconCalendar />

    default:
      return null
  }
}
