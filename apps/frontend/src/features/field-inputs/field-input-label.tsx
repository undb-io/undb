import { Group, Text } from '@undb/ui'
import React from 'react'

export const FieldInputLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Text size={12} fw={700} display="inline-block">
      <Group spacing="xs">{children}</Group>
    </Text>
  )
}
