import { Box, Tooltip } from '@egodb/ui'

export const ColorValue: React.FC<{ value: string }> = ({ value }) => {
  return (
    <Tooltip label={value} color={value}>
      <Box bg={value} w="100%" miw={20} lh={1} sx={(theme) => ({ borderRadius: theme.radius.sm })}>
        &nbsp;
      </Box>
    </Tooltip>
  )
}
