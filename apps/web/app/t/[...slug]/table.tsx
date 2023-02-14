'use client'

import { Box } from '@egodb/ui'
import { useEgoUITheme } from '@egodb/ui'
import { Stack } from '@egodb/ui'
import { CreateRecordFormDrawer } from '../../../components/create-record-form/create-record-form-drawer'
import { EditRecordFormDrawer } from '../../../components/edit-record-form/edit-record-form-drawer'
import { RecordSelectionDialog } from '../../../components/record-selection/record-selection-dialog'
import { TableToolbar } from '../../../components/table/table-toolbar'
import { ViewDisplay } from '../../../components/table/view-display'

export default function Table() {
  const theme = useEgoUITheme()

  return (
    <Stack h="100%" spacing={0}>
      <TableToolbar />
      <Box w="100%" h="100%" bg={theme.white} sx={{ overflow: 'scroll', flex: '1 1 auto' }}>
        <ViewDisplay />
      </Box>

      <CreateRecordFormDrawer />
      <EditRecordFormDrawer />

      <RecordSelectionDialog />
    </Stack>
  )
}
