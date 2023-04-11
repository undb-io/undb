import { useRoutes } from 'react-router-dom'
import { routes } from './router'
import { getIsAuthorized, useMeQuery } from '@undb/store'
import { useSelector } from 'react-redux'
import { useSetAtom } from 'jotai'
import { createTableFormDrawerOpened } from './features/create-table-form/drawer-opened.atom'
import { useHotkeys } from '@undb/ui'

function App() {
  const isAuthorized = useSelector(getIsAuthorized)
  useMeQuery(undefined, { refetchOnMountOrArgChange: true, skip: !isAuthorized })

  const setOpened = useSetAtom(createTableFormDrawerOpened)

  useHotkeys([['t', () => setOpened(true)]])

  const element = useRoutes(routes)

  return element
}

export default App
