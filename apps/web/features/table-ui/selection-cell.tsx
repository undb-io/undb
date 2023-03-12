import { Checkbox, Box, useHover, Text } from '@egodb/ui'
import type { Row } from '@tanstack/react-table'
import type { TData } from './interface'
import { usePinnedStyles } from './styles'

export const SelectionCell: React.FC<{ row: Row<TData> }> = ({ row }) => {
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

  const { classes, cx } = usePinnedStyles({})

  return (
    <Box component="td" className={cx([classes.cell, classes.sticky])} w="40px">
      <Box ref={ref} onClick={(e) => e.stopPropagation()}>
        {showCheckbox ? (
          checkbox
        ) : (
          <Text align="center" color="gray.6" size="sm">
            {row.index + 1}
          </Text>
        )}
      </Box>
    </Box>
  )
}
