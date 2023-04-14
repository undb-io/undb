import { Header } from '../features/header/header'
import { Box, Container } from '@undb/ui'
import { MemberList } from '../features/members/member-list'

export const Members: React.FC = () => {
  return (
    <Box h="100vh" bg="gray.0">
      <Header />
      <Container pt="xl" size="xl">
        <MemberList />
      </Container>
    </Box>
  )
}
