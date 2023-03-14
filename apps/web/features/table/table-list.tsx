import { TableFactory } from '@egodb/core'
import { getCurrentTableId, useGetTablesQuery } from '@egodb/store'
import { ActionIcon, Center, Flex, IconChevronDown, IconPlus, Menu, Tabs } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { unstable_batchedUpdates } from 'react-dom'
import { CurrentTableContext } from '../../context/current-table'
import { useAppSelector } from '../../hooks'
import { useCloseAllDrawers } from '../../hooks/use-close-all-drawers'
import { createTableFormDrawerOpened } from '../create-table-form/drawer-opened.atom'
import { UpdateTableFormDrawer } from '../update-table-form/update-table-form-drawer'
import { TableMenuDropdown } from './table-menu-dropdown'

export const TableList: React.FC = () => {
  const router = useRouter()
  const currentTableId = useAppSelector(getCurrentTableId)

  const tables = useGetTablesQuery({})

  const setOpened = useSetAtom(createTableFormDrawerOpened)
  const close = useCloseAllDrawers()

  return (
    <Flex>
      <Center>
        <Tabs
          variant="default"
          display="flex"
          value={currentTableId}
          onTabChange={(value) => router.push(`/t/${value}`)}
        >
          {Object.values(tables.data?.entities ?? {})
            .filter(Boolean)
            .map((t) => (
              <Tabs.Tab
                key={t.id}
                value={t.id}
                p="xs"
                rightSection={
                  t.id === currentTableId && (
                    <>
                      <Menu withinPortal width={200} shadow="xl">
                        <Menu.Target>
                          <ActionIcon size="xs">
                            <IconChevronDown />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <TableMenuDropdown tableId={t.id} />
                        </Menu.Dropdown>
                      </Menu>
                      <CurrentTableContext.Provider value={TableFactory.fromQuery(t)}>
                        <UpdateTableFormDrawer />
                      </CurrentTableContext.Provider>
                    </>
                  )
                }
              >
                {t.name}
              </Tabs.Tab>
            ))}
        </Tabs>
        <ActionIcon
          variant="subtle"
          onClick={() => {
            unstable_batchedUpdates(() => {
              close()
              setOpened(true)
            })
          }}
        >
          <IconPlus size={14} />
        </ActionIcon>
      </Center>
    </Flex>
  )
}
