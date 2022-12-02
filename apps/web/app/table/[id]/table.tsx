'use client'

import type { IGetTableOutput } from '@egodb/core'
import { EGOTable } from '@egodb/table-ui'
import { Box, Title } from '@egodb/ui'

interface IProps {
  table: NonNullable<IGetTableOutput>
}

export default function Table({ table }: IProps) {
  return (
    <Box>
      <Title>{table.name}</Title>
      <EGOTable table={table} />
    </Box>
  )
}
