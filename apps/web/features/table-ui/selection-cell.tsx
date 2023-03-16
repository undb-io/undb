import { Checkbox, Box, useHover, Text, Center } from '@egodb/ui'
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
          <Center>{checkbox}</Center>
        ) : (
          <Text
            align="center"
            color="gray.6"
            fz="xs"
            size="sm"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {row.index + 1}
          </Text>
        )}
      </Box>
    </Box>
  )
}
