import { Group, Skeleton } from '@egodb/ui'
import React from 'react'

export const TableLoading: React.FC = () => {
  return (
    <Group fz="md" p="md">
      <Skeleton h="30px" />
      <Skeleton h="30px" />
      <Skeleton h="100vh" />
    </Group>
  )
}
