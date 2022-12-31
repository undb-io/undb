import type { IViewDisplayType } from '@egodb/core'
import { IconLayoutKanban, IconTable } from '@egodb/ui'

export const DisplayTypeIcon: React.FC<{ displayType: IViewDisplayType }> = ({ displayType }) => {
  switch (displayType) {
    case 'grid':
      return <IconTable />
    case 'kanban':
      return <IconLayoutKanban />

    default:
      return null
  }
}
