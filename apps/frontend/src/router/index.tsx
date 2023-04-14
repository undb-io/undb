import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '../guard/protected-route'
import loadable from '@loadable/component'
import { Members } from '../pages/members'

const Table = loadable(() => import('../pages/table'))
const Root = loadable(() => import('../pages/root'))
const Login = loadable(() => import('../pages/login'))
const Register = loadable(() => import('../pages/register'))

export const routes: RouteObject[] = [
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
    path: '/members',
    element: <Members />,
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
