import type { IQueryUser } from '@undb/core'
import { Avatar, Box, Group, Paper, Text } from '@undb/ui'

interface IProps {
  member: IQueryUser
}

export const MemberListItem: React.FC<IProps> = ({ member }) => {
  return (
    <Paper p="lg" shadow="xs" radius="md">
      <Group>
        <Avatar src={member.avatar}>{member.username.slice(0, 2)}</Avatar>

        <Box>
          <Text>{member.username}</Text>
          <Text size="xs" color="gray">
            {member.email}
          </Text>
        </Box>
      </Group>
    </Paper>
  )
}
