import type { IQueryUser } from '@undb/core'
import { SimpleGrid, Stack, TextInput, Title } from '@undb/ui'

interface IProps {
  member: IQueryUser
}
export const MemberProfile: React.FC<IProps> = ({ member }) => {
  return (
    <Stack>
      <Title order={3}>Profile Setting</Title>

      <SimpleGrid cols={2}>
        <Title order={5}>Username</Title>

        <TextInput disabled value={member.username} />
      </SimpleGrid>
    </Stack>
  )
}
