import type { BoxProps } from '@mantine/core'
import { Box } from '@mantine/core'

export const Square: React.FC<BoxProps> = (props) => {
  return (
    <Box
      {...props}
      sx={{
        ...props.sx,
        ':before': {
          content: '""',
          display: 'block',
          paddingBottom: '100%',
        },
      }}
    ></Box>
  )
}
