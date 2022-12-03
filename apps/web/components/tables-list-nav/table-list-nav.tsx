import { Navbar, Box, Skeleton, NavLink, Center, Button, IconPlus, ScrollArea } from '@egodb/ui'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { trpc } from '../../trpc'
import { createTableFormDrawerOpened } from '../create-table-form/drawer-opened.atom'

export const TableNavList: React.FC = () => {
  const [, setOpened] = useAtom(createTableFormDrawerOpened)
  const getTables = trpc.table.list.useQuery({})

  return (
    <Navbar width={{ base: 300 }} p="sm">
      <Navbar.Section grow component={ScrollArea}>
        <Box>
          {getTables.isLoading && (
            <>
              <Skeleton visible={getTables.isLoading} height={30} />
              <Skeleton visible={getTables.isLoading} mt={6} height={30} />
              <Skeleton visible={getTables.isLoading} mt={6} height={30} />
            </>
          )}
          {getTables.data?.map((table) => (
            <Link href={`/table/${table.id}`}>
              <NavLink key={table.id} label={table.name} />
            </Link>
          ))}
        </Box>
        <Center mt="md">
          <Button fullWidth leftIcon={<IconPlus size={14} />} variant="outline" onClick={() => setOpened(true)}>
            New table
          </Button>
        </Center>
      </Navbar.Section>
    </Navbar>
  )
}
