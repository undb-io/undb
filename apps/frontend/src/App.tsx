import { useRoutes } from 'react-router-dom'
import { routes } from './router'
import { getIsAuthorized, useMeQuery } from '@undb/store'
import { useSelector } from 'react-redux'

function App() {
  const isAuthorized = useSelector(getIsAuthorized)
  useMeQuery(undefined, { refetchOnMountOrArgChange: true, skip: !isAuthorized })

  const element = useRoutes(routes)

  return element
}

export default App
