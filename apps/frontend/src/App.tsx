import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { getIsAuthorized, useMeQuery } from '@egodb/store'
import { useSelector } from 'react-redux'

function App() {
  const isAuthorized = useSelector(getIsAuthorized)
  useMeQuery(undefined, { skip: !isAuthorized })

  return <RouterProvider router={router} />
}

export default App
