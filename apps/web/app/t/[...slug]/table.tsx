'use client'

import { Box } from '@egodb/ui'
import { useEgoUITheme } from '@egodb/ui'
import { Stack } from '@egodb/ui'
import dynamic from 'next/dynamic'

import { RecordSelectionDialog } from '../../../features/record-selection/record-selection-dialog'
import { TableToolbar } from '../../../features/table/table-toolbar'
import { ViewDisplay } from '../../../features/table/view-display'

const CreateRecordFormDrawer = dynamic(() =>
  import('../../../features/create-record-form/create-record-form-drawer').then((m) => m.CreateRecordFormDrawer),
)
const UpdateRecordFormDrawer = dynamic(() =>
  import('../../../features/update-record-form/update-record-form-drawer').then((m) => m.UpdateRecordFormDrawer),
)
const ViewsListDrawer = dynamic(() =>
  import('../../../features/views/views-list-drawer').then((m) => m.ViewsListDrawer),
)

export default function Table() {
  const theme = useEgoUITheme()

  return (
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
  )
}
