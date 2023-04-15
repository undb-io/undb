import { useMeQuery } from '@undb/store'
import { Box, Container } from '@undb/ui'
import { Header } from '../features/header/header'
import { MemberProfile } from '../features/profile/member-profile'

export const MyProfile = () => {
  const me = useMeQuery()

  if (!me.data) return null

  return (
    <Box h="100vh" bg="gray.0">
      <Header />
      <Container pt="xl">
        <MemberProfile member={me.data.me} />
      </Container>
    </Box>
  )
}
