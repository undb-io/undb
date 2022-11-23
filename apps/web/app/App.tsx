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
  zodResolver,
  Group,
  Divider,
  Alert,
  IconAlertCircle,
} from '@egodb/ui'
import { createTableCommandInput, type ICreateTableInput } from '@egodb/core'
import { trpc } from '../trpc'

export default function App() {
  const [opened, toggle] = useToggle()
  const theme = useEgoUITheme()
  const form = useForm<ICreateTableInput>({
    initialValues: {
      name: '',
    },
    validate: zodResolver(createTableCommandInput),
  })

  const createTable = trpc.table.create.useMutation({
    onSuccess: () => toggle(false),
  })
  const onSubmit = form.onSubmit((values) => {
    createTable.mutate(values)
  })

  return (
    <>
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 250 }} p="xl">
            <Navbar.Section grow>
              <Center>
                <Button
                  color="dark"
                  fullWidth
                  leftIcon={<IconPlus size={14} />}
                  variant="outline"
                  onClick={() => toggle(true)}
                >
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
        {null}
      </AppShell>
      <Drawer
        opened={opened}
        onClose={() => {
          form.reset()
          createTable.reset()
          toggle(false)
        }}
        title="New Table"
        padding="xl"
        position="right"
        size={700}
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <form onSubmit={onSubmit}>
          <TextInput error={form.errors['name']} label="Name" {...form.getInputProps('name')} />
          <Divider my="lg" />
          <Group position="right">
            <Button color="dark" variant="subtle" onClick={() => toggle(false)}>
              Cancel
            </Button>
            <Button loading={createTable.isLoading} miw={200} color="dark" disabled={!form.isValid()} type="submit">
              Create
            </Button>
          </Group>
          {createTable.isError && (
            <Alert icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg" color="red">
              {createTable.error.message}
            </Alert>
          )}
        </form>
      </Drawer>
    </>
  )
}
