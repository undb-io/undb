import { TableFactory } from '@egodb/core'
import { resetCurrentTableId, setCurrentTableId, setCurrentViewId, useGetTableQuery } from '@egodb/store'
import type { TRPCError } from '@egodb/trpc'
import { Alert, Box, Container, IconAlertCircle, ModalsProvider, Stack, useEgoUITheme } from '@egodb/ui'
import { useEffect } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { CurrentTableContext } from '../context/current-table'
import { CurrentViewContext } from '../context/current-view'
import { CreateRecordFormDrawer } from '../features/create-record-form/create-record-form-drawer'
import { TableLoading } from '../features/loading'
import { RecordSelectionDialog } from '../features/record-selection/record-selection-dialog'
import { TableToolbar } from '../features/table/table-toolbar'
import { ViewDisplay } from '../features/table/view-display'
import { UpdateRecordFormDrawer } from '../features/update-record-form/update-record-form-drawer'
import { ViewsListDrawer } from '../features/views/views-list-drawer'
import { useAppDispatch } from '../hooks'
import { modals } from '../modals'
import { useNavigate, useParams } from 'react-router-dom'

export const Table = () => {
  const { tableId, viewId } = useParams()
  const { data, isLoading, isError, error } = useGetTableQuery({ id: tableId! })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const theme = useEgoUITheme()

  useEffect(() => {
    unstable_batchedUpdates(() => {
      dispatch(setCurrentTableId(tableId!))
      dispatch(setCurrentViewId(viewId || undefined))
    })
  }, [tableId, viewId])

  if (isLoading) {
    return <TableLoading />
  }

  if (isError) {
    return (
      <Container>
        <Alert icon={<IconAlertCircle size={16} />} title="Oops! Get Table Error!" mt="lg" color="red">
          {(error as TRPCError).message}
        </Alert>
      </Container>
    )
  }

  if (!data) {
    dispatch(resetCurrentTableId())
    navigate('/', { replace: true })
    return null
  }
  const table = TableFactory.fromQuery(data)
  const view = table.mustGetView(viewId)

  return (
    <CurrentTableContext.Provider value={table}>
      <CurrentViewContext.Provider value={view}>
        <ModalsProvider modals={modals as any}>
          <Stack h="100%" spacing={0}>
            <TableToolbar />
            <Box w="100%" h="100%" bg={theme.white} sx={{ overflow: 'scroll', flex: '1 1 auto' }}>
              <ViewDisplay />
            </Box>

            <CreateRecordFormDrawer />
            <UpdateRecordFormDrawer />
            <ViewsListDrawer />

            <RecordSelectionDialog />
          </Stack>
        </ModalsProvider>
      </CurrentViewContext.Provider>
    </CurrentTableContext.Provider>
  )
}
