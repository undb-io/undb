import type { IQueryUser } from '@undb/core'
import { useMeQuery } from '@undb/store'
import { Avatar, Badge, Box, Group, Paper, Text } from '@undb/ui'
import { t } from 'i18next'

interface IProps {
  member: IQueryUser
}

export const MemberListItem: React.FC<IProps> = ({ member }) => {
  const { data } = useMeQuery()
  const isMe = member.userId === data?.me.userId

  return (
    <Paper p="lg" shadow="xs" radius="md">
      <Group position="apart">
        <Group>
          <Avatar src={member.avatar}>{member.username.slice(0, 2)}</Avatar>

          <Box>
            <Text>{member.username}</Text>
            <Text size="xs" color="gray">
              {member.email}
            </Text>
          </Box>
        </Group>

        {isMe && <Badge>{t('You', { ns: 'common' })}</Badge>}
      </Group>
    </Paper>
  )
}
