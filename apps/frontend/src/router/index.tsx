import { ProtectedRoute } from '../guard/protected-route'
import loadable from '@loadable/component'

const Table = loadable(() => import('../pages/table'))
const Root = loadable(() => import('../pages/root'))
const Login = loadable(() => import('../pages/login'))
const Register = loadable(() => import('../pages/register'))

export const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 't/:tableId/:viewId?',
        element: <Table />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]
