import type { UniqueIdentifier } from '@dnd-kit/core'
import type { Table } from '@egodb/core'
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  IconChevronDown,
  IconGripVertical,
  IconTrashX,
  Text,
  useEgoUITheme,
} from '@egodb/ui'
import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { useConfirmModal } from '../../hooks'
import { trpc } from '../../trpc'

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: UniqueIdentifier
  table: Table
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
      id,
      table,
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

    const utils = trpc.useContext()

    const deleteRecord = trpc.record.delete.useMutation({
      onSuccess() {
        utils.record.tree.list.refetch()
      },
    })
    const confirm = useConfirmModal({
      onConfirm() {
        deleteRecord.mutate({
          tableId: table.id.value,
          id: id as string,
        })
      },
    })

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
          position="apart"
        >
          <Group>
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
            {clone && childCount && childCount > 1 ? <Badge radius="xl">{childCount}</Badge> : null}
          </Group>
          {!clone && onRemove && (
            <ActionIcon
              onClick={confirm}
              color="gray.3"
              sx={(theme) => ({
                ':hover': {
                  color: theme.colors.red[4],
                },
              })}
            >
              <IconTrashX size={14} />
            </ActionIcon>
          )}
        </Group>
      </Box>
    )
  },
)
