'use client'

import { AppShell, Button, EgoUIProvider, Header, Navbar } from '@egodb/ui'

export default function App() {
  return (
    <EgoUIProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 300 }} p="xs">
            <Navbar.Section>First section</Navbar.Section>
            <Navbar.Section grow>Grow section</Navbar.Section>
            <Navbar.Section>Last section</Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={60} p="xs">
            {/* Header content */}
          </Header>
        }
      >
        <Button>hello EGO</Button>
      </AppShell>
    </EgoUIProvider>
  )
}
