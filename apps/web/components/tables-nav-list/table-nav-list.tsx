import type { IQueryTable } from '@egodb/core'
import { useGetTablesQuery } from '@egodb/store'
import { Navbar, Box, Skeleton, NavLink, Center, Button, IconPlus, ScrollArea } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import { unstable_batchedUpdates } from 'react-dom'
import { createTableFormDrawerOpened } from '../create-table-form/drawer-opened.atom'
import { editRecordFormDrawerOpened } from '../edit-record-form/drawer-opened.atom'
import { tableListNumber } from './table-list.atom'

export const TableNavList: React.FC = () => {
  const setOpened = useSetAtom(createTableFormDrawerOpened)
  const setEditRecordOpened = useSetAtom(editRecordFormDrawerOpened)
  const setTableListNumber = useSetAtom(tableListNumber)
  const { data, isLoading, tablesList } = useGetTablesQuery(
    {},
    {
      selectFromResult: (result) => ({
        ...result,
        tablesList: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryTable[],
      }),
    },
  )
  if (data) {
    setTableListNumber(tablesList.length)
  }

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
                setEditRecordOpened(false)
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
