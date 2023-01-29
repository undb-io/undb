import { ActionIcon, Box, Flex, IconGripVertical } from '@egodb/ui'
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
  indicator?: boolean
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
      indicator,
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
    return (
      <Box ref={wrapperRef} mb={-1} {...props} pl={indentationWidth * depth}>
        <Flex
          ref={ref}
          style={style}
          align="center"
          py="xs"
          px="md"
          sx={(theme) => ({
            border: '1px solid ' + theme.colors.gray[5],
          })}
        >
          <ActionIcon {...handleProps}>
            <IconGripVertical size={16} />
          </ActionIcon>
          {/* {onCollapse && (
            <Action onClick={onCollapse} className={classNames(styles.Collapse, collapsed && styles.collapsed)}>
              {collapseIcon}
            </Action>
          )} */}
          <span>{value}</span>
          {/* {!clone && onRemove && <Remove onClick={onRemove} />} */}
          {/* {clone && childCount && childCount > 1 ? <span className={styles.Count}>{childCount}</span> : null} */}
        </Flex>
      </Box>
    )
  },
)
