'use client'

import type { NonNullableGetTableOutput } from '@egodb/core'
import { EGOTable } from '@egodb/table-ui'
import { Box } from '@egodb/ui'
import { TableHaeder } from '../../../components/table/table-title'

interface IProps {
  table: NonNullableGetTableOutput
}

export default function Table({ table }: IProps) {
  return (
    <Box>
      <TableHaeder table={table} />
      <EGOTable table={table} />
    </Box>
  )
}
