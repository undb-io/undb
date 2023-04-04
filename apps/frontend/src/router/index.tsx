import { createBrowserRouter } from 'react-router-dom'
import { Table } from '../pages/table'
import { Root } from '../pages/root'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 't/:tableId/:viewId?',
        element: <Table />,
      },
    ],
  },
])
