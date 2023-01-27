import type { IViewDisplayType } from '@egodb/core'
import { IconCalendar, IconHierarchy, IconLayoutKanban, IconTable } from '@egodb/ui'

export const DisplayTypeIcon: React.FC<{ displayType: IViewDisplayType }> = ({ displayType }) => {
  switch (displayType) {
    case 'grid':
      return <IconTable size={18} />
    case 'kanban':
      return <IconLayoutKanban size={18} />
    case 'calendar':
      return <IconCalendar size={18} />
    case 'tree':
      return <IconHierarchy size={18} />

    default:
      return null
  }
}
