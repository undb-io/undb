import { TableFactory } from '@undb/core'
import { getCurrentTableId, useGetTablesQuery } from '@undb/store'
import { ActionIcon, Center, Flex, IconChevronDown, IconPlus, Loader, Menu, Tabs } from '@undb/ui'
import { useSetAtom } from 'jotai'
import { useNavigate, useParams } from 'react-router-dom'
import { unstable_batchedUpdates } from 'react-dom'
import { CurrentTableContext } from '../../context/current-table'
import { useAppSelector } from '../../hooks'
import { useCloseAllDrawers } from '../../hooks/use-close-all-drawers'
import { createTableFormDrawerOpened } from '../create-table-form/drawer-opened.atom'
import { UpdateTableFormDrawer } from '../update-table-form/update-table-form-drawer'
import { TableMenuDropdown } from './table-menu-dropdown'
import { useEffect } from 'react'
import { EmptyTableList } from './empty-table-list'
import { Emoji } from 'emoji-picker-react'

export const TableList: React.FC = () => {
  const navigate = useNavigate()
  const { tableId } = useParams()

  const currentTableId = useAppSelector(getCurrentTableId)

  const { data, isLoading, isSuccess } = useGetTablesQuery({})

  useEffect(() => {
    if (!tableId) {
      if (currentTableId) {
        navigate(`/t/${currentTableId}`, { replace: true })
      } else if (data?.ids.length) {
        navigate(`/t/${data.ids.at(0)}`, { replace: true })
      }
    }
  }, [tableId])

  const setOpened = useSetAtom(createTableFormDrawerOpened)
  const close = useCloseAllDrawers()

  if (isLoading && !currentTableId) {
    return (
      <Center w="100%" h="100%">
        <Loader />
      </Center>
    )
  }

  if (!data?.ids.length && !currentTableId) {
    return <EmptyTableList />
  }

  return (
    <Flex h={40}>
      <Center>
        <Tabs
          variant="default"
          display="flex"
          value={currentTableId}
          onTabChange={(value) => {
            if (value !== currentTableId) {
              navigate(`/t/${value}`)
            }
          }}
        >
          {Object.values(data?.entities ?? {})
            .filter(Boolean)
            .map((t) => (
              <Tabs.Tab
                key={t.id}
                value={t.id}
                p="xs"
                icon={<Emoji size={14} unified={t.emoji} />}
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
        {!!(isSuccess && data.ids.length) && (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation()
              unstable_batchedUpdates(() => {
                close()
                setOpened(true)
              })
            }}
          >
            <IconPlus size={14} />
          </ActionIcon>
        )}
      </Center>
    </Flex>
  )
}
