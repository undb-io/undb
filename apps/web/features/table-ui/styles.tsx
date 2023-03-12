import type { CSSObject, MantineTheme } from '@egodb/ui'
import { createStyles } from '@egodb/ui'

interface PinnedTDProps {
  left?: number
}

type PinnedClassName = 'cell' | 'sticky' | 'last'

export const usePinnedStyles: ReturnType<typeof createStyles<PinnedClassName, PinnedTDProps>> = createStyles(
  (theme, { left }: PinnedTDProps) => ({
    cell: {
      position: 'relative',
    },
    sticky: {
      position: 'sticky',
      left: left ? left + 'px' : 0,
      top: 0,
    },
    last: {
      boxShadow: 'rgb(7 0 20 / 10%) 1px 0px 3px 0px, rgb(7 0 20 / 6%) 1px 0px 2px 0px',
    },
  }),
)

export const tableStyles = (theme: MantineTheme): CSSObject => ({
  borderCollapse: 'separate',
  borderSpacing: 0,
  tableLayout: 'fixed',
  backgroundColor: theme.white,
  borderTop: '0',
  borderLeft: '0',
  table: {
    border: '0',
  },
  thead: {
    margin: 0,
    position: 'sticky',
    top: 0,
    border: 0,
    zIndex: 100,
    backgroundColor: theme.white,
  },
  'thead tr': {
    border: '0',
    outline: '1px solid ' + theme.colors.gray[2],
  },
  'thead tr td': {
    borderRight: '1px solid ' + theme.colors.gray[2],
  },
  'thead tr th': {
    userSelect: 'none',
    backgroundColor: theme.white,
    borderBottom: 0,
  },
  'tbody tr': {
    cursor: 'pointer',
    height: 32,
    borderBottom: '1px solid ' + theme.colors.gray[2],
  },
  'tbody tr td': {
    borderRight: '1px solid ' + theme.colors.gray[2],
    ':last-child': {
      border: '0',
    },
  },
  'tbody tr:hover td:last-child': {
    cursor: 'unset',
    backgroundColor: theme.white,
  },
})
