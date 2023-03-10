import { Checkbox, Box, useHover, Text } from '@egodb/ui'
import type { Row } from '@tanstack/react-table'
import type { TData } from './interface'

export const RecordSelection: React.FC<{ row: Row<TData> }> = ({ row }) => {
  const { hovered, ref } = useHover()

  const isSelected = row.getIsSelected()
  const showCheckbox = isSelected || hovered

  const checkbox = (
    <Checkbox
      size="xs"
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
      disabled={!row.getCanSelect()}
    />
  )
  return (
    <td
      style={{
        width: '40px',
        position: 'sticky',
        left: 0,
        top: 0,
        zIndex: 1,
        backgroundColor: 'white',
      }}
    >
      <Box ref={ref} onClick={(e) => e.stopPropagation()}>
        {showCheckbox ? (
          checkbox
        ) : (
          <Text align="center" color="gray.6" size="sm">
            {row.index + 1}
          </Text>
        )}
      </Box>
    </td>
  )
}
