import { Text } from '@egodb/ui'
import React from 'react'

export const FieldInputLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Text size={12} fw={700} tt="uppercase" display="inline-block">
      {children}
    </Text>
  )
}
