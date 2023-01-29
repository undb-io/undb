import { ActionIcon, Badge, Box, Group, IconChevronDown, IconGripVertical, Text, useEgoUITheme } from '@egodb/ui'
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
      <Box
        ref={wrapperRef}
        mb={-1}
        ml={-1}
        {...props}
        pl={indentationWidth * depth}
        sx={{
          ':first-child': {
            marginTop: '-1px',
          },
        }}
      >
        <Group
          ref={ref}
          style={style}
          align="center"
          spacing="xs"
          py="xs"
          px="md"
          bg={theme.white}
          sx={(theme) => ({
            border: '1px solid ' + theme.colors.gray[3],
          })}
        >
          <Group spacing="xs">
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
                <IconChevronDown size="14" />
              </ActionIcon>
            )}
          </Group>
          <Text color="gray.7">{value}</Text>
          {/* {!clone && onRemove && <Remove onClick={onRemove} />} */}
          {clone && childCount && childCount > 1 ? <Badge radius="xl">{childCount}</Badge> : null}
        </Group>
      </Box>
    )
  },
)
