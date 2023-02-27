import { getCurrentTableId, useGetTablesQuery } from '@egodb/store'
import { ActionIcon, Center, Flex, IconPlus, Tabs } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '../../hooks'
import { createTableFormDrawerOpened } from '../create-table-form/drawer-opened.atom'

export const TableList: React.FC = () => {
  const router = useRouter()
  const currentTableId = useAppSelector(getCurrentTableId)

  const tables = useGetTablesQuery({})

  const setOpened = useSetAtom(createTableFormDrawerOpened)

  return (
    <Flex>
      <Center>
        <Tabs
          variant="outline"
          display="flex"
          value={currentTableId}
          onTabChange={(value) => router.push(`/t/${value}`)}
        >
          {Object.values(tables.data?.entities ?? {})
            .filter(Boolean)
            .map((t) => (
              <Tabs.Tab key={t.id} value={t.id}>
                {t.name}
              </Tabs.Tab>
            ))}
        </Tabs>
        <ActionIcon variant="subtle" onClick={() => setOpened(true)}>
          <IconPlus size={14} />
        </ActionIcon>
      </Center>
    </Flex>
  )
}
