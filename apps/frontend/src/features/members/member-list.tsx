import { useGetUsersQuery } from '@undb/store'
import { Space, Stack, Title } from '@undb/ui'
import { MemberListItem } from './member-list-item'

export const MemberList: React.FC = () => {
  const { data } = useGetUsersQuery({})

  return (
    <>
      <Title order={3}>Members</Title>

      <Space my="xl" />

      <Stack>
        {data?.ids.map((id) => (
          <MemberListItem key={id} member={data.entities[id]!} />
        ))}
      </Stack>
    </>
  )
}
