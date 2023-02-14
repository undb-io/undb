import type { IQueryTable } from '@egodb/core'
import { getCurrentTableId, useGetTablesQuery } from '@egodb/store'
import { Tabs } from '@egodb/ui'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '../../hooks'

export const TableList: React.FC = () => {
  const router = useRouter()
  const currentTableId = useAppSelector(getCurrentTableId)

  const tables = useGetTablesQuery({})

  return (
    <Tabs variant="outline" display="flex" value={currentTableId} onTabChange={(value) => router.push(`/t/${value}`)}>
      {Object.values(tables.data?.entities ?? {})
        .filter(Boolean)
        .map((t) => {
          t = t as IQueryTable
          return (
            <Tabs.Tab key={t.id} value={t.id}>
              {t.name}
            </Tabs.Tab>
          )
        })}
    </Tabs>
  )
}
