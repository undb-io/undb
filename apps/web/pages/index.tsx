import { AppShell, Button, EgoUIProvider, Header, Navbar } from '@egodb/ui'

export default function Web() {
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
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <Button>hello EGO</Button>
      </AppShell>
    </EgoUIProvider>
  )
}
