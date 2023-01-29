import { ActionIcon, Box, Flex, IconGripVertical, useEgoUITheme } from '@egodb/ui'
import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  childCount?: number
  clone?: boolean
  collapsed?: boolean
  depth: number
  disableInteraction?: boolean
  disableSelection?: boolean
  ghost?: boolean
  handleProps?: any
  indentationWidth: number
  value: string
  onCollapse?(): void
  onRemove?(): void
  wrapperRef?(node: HTMLDivElement): void
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref,
  ) => {
    const theme = useEgoUITheme()

    return (
      <Box ref={wrapperRef} mb={-1} {...props} pl={indentationWidth * depth}>
        <Flex
          ref={ref}
          style={style}
          align="center"
          py="xs"
          px="md"
          bg={theme.white}
          sx={(theme) => ({
            border: '1px solid ' + theme.colors.gray[5],
          })}
        >
          <ActionIcon {...handleProps}>
            <IconGripVertical size={16} />
          </ActionIcon>
          {onCollapse && (
            <ActionIcon
              sx={{
                svg: {
                  transition: 'transform 250ms ease',
                  transform: collapsed ? 'rotate(-90deg)' : 'unset',
                },
              }}
              onClick={onCollapse}
            >
              {collapseIcon}
            </ActionIcon>
          )}
          <span>{value}</span>
          {/* {!clone && onRemove && <Remove onClick={onRemove} />} */}
          {/* {clone && childCount && childCount > 1 ? <span className={styles.Count}>{childCount}</span> : null} */}
        </Flex>
      </Box>
    )
  },
)

const collapseIcon = (
  <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
    <path d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
  </svg>
)
