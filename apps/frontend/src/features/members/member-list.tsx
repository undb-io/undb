import { useGetUsersQuery } from '@undb/store'
import { Space, Stack, Title } from '@undb/ui'
import { MemberListItem } from './member-list-item'
import { useTranslation } from 'react-i18next'

export const MemberList: React.FC = () => {
  const { data } = useGetUsersQuery({})
  const { t } = useTranslation()

  return (
    <>
      <Title order={3}>{t('Members', { ns: 'common' })}</Title>

      <Space my="xl" />

      <Stack>
        {data?.ids.map((id) => (
          <MemberListItem key={id} member={data.entities[id]!} />
        ))}
      </Stack>
    </>
  )
}
