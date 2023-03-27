import { createStyles } from '@egodb/ui'
import '@emotion/react'

export const useMenuStyle: ReturnType<typeof createStyles<'menu', object>> = createStyles((theme) => ({
  menu: {
    padding: theme.spacing.xs,
    fontSize: theme.fontSizes.xs,
    height: '35px',
  },
}))
