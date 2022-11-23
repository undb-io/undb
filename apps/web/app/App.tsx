'use client'

import {
  AppShell,
  Button,
  Center,
  Drawer,
  Header,
  IconPlus,
  Navbar,
  useEgoUITheme,
  useToggle,
  useForm,
  TextInput,
  Group,
} from '@egodb/ui'
import { type ICreateTableInput } from '@egodb/core'

export default function App() {
  const [opened, toggle] = useToggle()
  const theme = useEgoUITheme()
  const form = useForm<ICreateTableInput>({
    initialValues: {
      name: '',
    },
  })

  return (
    <>
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 250 }} p="xl">
            <Navbar.Section grow>
              <Center>
                <Button fullWidth leftIcon={<IconPlus size={14} />} variant="outline" onClick={() => toggle(true)}>
                  New table
                </Button>
              </Center>
            </Navbar.Section>
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
      <Drawer
        opened={opened}
        onClose={() => toggle(false)}
        title="New Table"
        padding="xl"
        position="right"
        size="xl"
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <form onSubmit={form.onSubmit((values) => alert(values))}>
          <TextInput label="Name" {...form.getInputProps('email')} />
          <Group mt="md">
            <Button disabled={!form.isValid()} type="submit" fullWidth>
              Submit
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  )
}
