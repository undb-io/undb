import type { UniqueIdentifier } from '@dnd-kit/core'
import type { RecordAllValues, Table, TreeField } from '@egodb/core'
import { setSelectedRecordId, useDeleteRecordMutation } from '@egodb/store'
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  IconChevronDown,
  IconGripVertical,
  IconPlus,
  IconTrashX,
  Text,
  Tooltip,
  useEgoUITheme,
} from '@egodb/ui'
import { useSetAtom } from 'jotai'
import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { useAppDispatch, useConfirmModal } from '../../hooks'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import { editRecordFormDrawerOpened } from '../edit-record-form/drawer-opened.atom'
import { FieldIcon } from '../field-inputs/field-Icon'
import { FieldValueFactory } from '../field-value/field-value.factory'
import { RecordId } from '../field-value/record-id'

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: UniqueIdentifier
  values: RecordAllValues
  field: TreeField
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
  onCollapse?(): void
  onRemove?(): void
  wrapperRef?(node: HTMLDivElement): void
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      id,
      values,
      table,
      field,
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
      wrapperRef,
      ...props
    },
    ref,
  ) => {
    const schema = table.schema.toIdMap()
    const theme = useEgoUITheme()

    const setOpened = useSetAtom(editRecordFormDrawerOpened)
    const dispatch = useAppDispatch()

    const setCreateOpened = useSetAtom(createRecordFormDrawerOpened)
    const setCreateRecordInitialValue = useSetAtom(createRecordInitialValueAtom)

    const [deleteRecord] = useDeleteRecordMutation()
    const confirm = useConfirmModal({
      onConfirm() {
        deleteRecord({
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
        onClick={() => {
          unstable_batchedUpdates(() => {
            dispatch(setSelectedRecordId(id as string))
            setOpened(true)
          })
        }}
        sx={{
          cursor: 'pointer',
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
              <ActionIcon {...handleProps} sx={{ cursor: 'grab' }}>
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
                  onClick={(e) => {
                    e.stopPropagation()
                    onCollapse()
                  }}
                >
                  <IconChevronDown size="14" />
                </ActionIcon>
              )}
            </Group>
            <Group>
              <RecordId id={id as string} />
              {Object.entries(values).map(([fieldId, value]) => {
                const field = schema.get(fieldId)
                if (!field) return null

                return (
                  <Tooltip
                    label={
                      <Group spacing="xs">
                        <FieldIcon type={field.type} />
                        <Text>{field.name.value}</Text>
                      </Group>
                    }
                  >
                    <Group spacing="xs">
                      <FieldIcon color="gray" type={field.type} />
                      <FieldValueFactory field={field} value={value} displayValues={values.display_values} />
                    </Group>
                  </Tooltip>
                )
              })}
            </Group>
            {clone && childCount && childCount > 1 ? <Badge radius="xl">{childCount}</Badge> : null}
          </Group>
          <Group>
            <ActionIcon
              onClick={(e) => {
                e.stopPropagation()
                unstable_batchedUpdates(() => {
                  if (field.parentFieldId) {
                    setCreateRecordInitialValue({ [field.parentFieldId.value]: id })
                  }
                  setCreateOpened(true)
                })
              }}
              color="gray.5"
            >
              <IconPlus size={14} />
            </ActionIcon>
            {!clone && onRemove && (
              <ActionIcon
                onClick={(e) => {
                  e.stopPropagation()
                  confirm()
                }}
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
        </Group>
      </Box>
    )
  },
)
