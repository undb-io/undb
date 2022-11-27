import { Navbar, Box, Skeleton, NavLink, Center, Button, IconPlus } from '@egodb/ui'
import { useAtom } from 'jotai'
import { trpc } from '../../trpc'
import { createTableFormDrawerOpened } from '../create-table-form/drawer-opened.atom'

export const TableNavList: React.FC = () => {
  const [, setOpened] = useAtom(createTableFormDrawerOpened)
  const getTables = trpc.table.list.useQuery({})

  return (
    <Navbar width={{ base: 250 }} p="xl">
      <Navbar.Section grow>
        <Box>
          {getTables.isLoading && (
            <>
              <Skeleton visible={getTables.isLoading} height={30} />
              <Skeleton visible={getTables.isLoading} mt={6} height={30} />
              <Skeleton visible={getTables.isLoading} mt={6} height={30} />
            </>
          )}
          {getTables.data?.map((table) => (
            <NavLink key={table.id} label={table.name} />
          ))}
        </Box>
        <Center mt="md">
          <Button
            color="dark"
            fullWidth
            leftIcon={<IconPlus size={14} />}
            variant="outline"
            onClick={() => setOpened(true)}
          >
            New table
          </Button>
        </Center>
      </Navbar.Section>
    </Navbar>
  )
}
