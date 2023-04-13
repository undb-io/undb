import type { ICollaboratorProfile } from '@undb/core'
import { Avatar, Group, Text } from '@undb/ui'

interface IProps {
  collaborator: ICollaboratorProfile
}

export const CollaboratorValue: React.FC<IProps> = ({ collaborator }) => {
  return (
    <Group spacing={3}>
      <Avatar size="xs">{collaborator.username?.slice(0, 2)}</Avatar>
      <Text ml="xs">{collaborator.username}</Text>
    </Group>
  )
}
