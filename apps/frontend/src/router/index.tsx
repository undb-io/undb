import { lazy } from 'react'
import { ProtectedRoute } from '../guard/protected-route'

const Table = lazy(() => import('../pages/table'))
const Root = lazy(() => import('../pages/root'))
const Login = lazy(() => import('../pages/login'))
const Register = lazy(() => import('../pages/register'))

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
