import type { IViewDisplayType } from '@egodb/core'
import type { TablerIconsProps } from '@egodb/ui'
import { IconCalendar, IconHierarchy, IconLayoutKanban, IconTable } from '@egodb/ui'

export interface IProps extends TablerIconsProps {
  displayType: IViewDisplayType
}

export const DisplayTypeIcon: React.FC<IProps> = ({ displayType, ...rest }) => {
  switch (displayType) {
    case 'grid':
      return <IconTable size={18} {...rest} />
    case 'kanban':
      return <IconLayoutKanban size={18} {...rest} />
    case 'calendar':
      return <IconCalendar size={18} {...rest} />
    case 'tree':
      return <IconHierarchy size={18} {...rest} />

    default:
      return null
  }
}
