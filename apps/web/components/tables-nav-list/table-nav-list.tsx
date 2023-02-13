import type { IQueryTable } from '@egodb/core'
import { resetSelectedRecordId, useGetTablesQuery } from '@egodb/store'
import { Navbar, Box, Skeleton, NavLink, Center, Button, IconPlus, ScrollArea } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import { unstable_batchedUpdates } from 'react-dom'
import { useAppDispatch } from '../../hooks'
import { createTableFormDrawerOpened } from '../create-table-form/drawer-opened.atom'

export const TableNavList: React.FC = () => {
  const dispatch = useAppDispatch()
  const setOpened = useSetAtom(createTableFormDrawerOpened)
  const { isLoading, tablesList } = useGetTablesQuery(
    {},
    {
      selectFromResult: (result) => ({
        ...result,
        tablesList: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryTable[],
      }),
    },
  )

  return (
    <Navbar width={{ base: 300 }} p="sm">
      <Navbar.Section grow component={ScrollArea}>
        <Box>
          {isLoading && (
            <>
              <Skeleton visible={isLoading} height={30} />
              <Skeleton visible={isLoading} mt={6} height={30} />
              <Skeleton visible={isLoading} mt={6} height={30} />
            </>
          )}
          {tablesList?.map((table) => (
            <Link key={table.id} href={`/t/${table.id}`}>
              <NavLink label={table.name} />
            </Link>
          ))}
        </Box>
        <Center mt="md">
          <Button
            fullWidth
            leftIcon={<IconPlus size={14} />}
            variant="outline"
            onClick={() => {
              unstable_batchedUpdates(() => {
                dispatch(resetSelectedRecordId())
                setOpened(true)
              })
            }}
          >
            New table
          </Button>
        </Center>
      </Navbar.Section>
    </Navbar>
  )
}
