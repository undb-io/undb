import { Text, UnstyledButton } from '@egodb/ui'
import { flexRender } from '@tanstack/react-table'
import type { THeader } from './interface'

export const Th: React.FC<{ header: THeader }> = ({ header }) => {
  return (
    <th key={header.id}>
      <UnstyledButton
        w="100%"
        h={45}
        px="lg"
        sx={(theme) => ({
          ':hover': { backgroundColor: theme.colors.gray[2] },
        })}
      >
        <Text fz="sm" color="gray.7" fw={500}>
          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        </Text>
      </UnstyledButton>
    </th>
  )
}
