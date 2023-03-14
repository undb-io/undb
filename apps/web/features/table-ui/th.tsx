import { ActionIcon, Box, Group, IconSortAscending, IconSortDescending, Text, Tooltip } from '@egodb/ui'
import styled from '@emotion/styled'
import type { TColumn, THeader } from './interface'
import type { Field } from '@egodb/core'
import { memo } from 'react'
import { FieldIcon } from '../field-inputs/field-Icon'
import { TableUIFieldMenu } from '../table/table-ui-field-menu'
import { useSetFieldSortMutation, useSetFieldWidthMutation } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { usePinnedStyles } from './styles'
import { useTranslation } from 'react-i18next'

const ResizerLine = styled.div<{ isResizing: boolean }>`
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 2px;
  background-color: #2d7ff9;
  opacity: ${(props) => (props.isResizing ? 1 : 0)};
`

const Resizer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 3px;
  cursor: ew-resize;
  user-select: none;
  touch-action: none;

  :hover {
    .line {
      opacity: 1;
    }
  }
`

interface IProps {
  header: THeader
  column: TColumn
  field: Field
  index: number
}

// eslint-disable-next-line react/display-name
export const Th: React.FC<IProps> = memo(({ header, field, column, index }) => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const direction = view.getFieldSort(field.id.value).into()
  const [setFieldWidth] = useSetFieldWidthMutation()
  const [setFieldSort] = useSetFieldSortMutation()

  const onSetFieldWidth = (fieldId: string, width: number) => {
    setFieldWidth({
      tableId: table.id.value,
      fieldId,
      viewId: view.id.value,
      width,
    })
  }

  const pinned = header.column.getIsPinned()
  const isLastPinned = header.column.getPinnedIndex() === header.getContext().table.getLeftLeafHeaders().length - 1

  const { classes, cx } = usePinnedStyles({ left: header.getStart() })
  const { t } = useTranslation()

  return (
    <Box
      component="th"
      data-field-id={field.id.value}
      key={header.id}
      className={cx(classes.cell, { [classes.sticky]: pinned, [classes.last]: isLastPinned })}
      w={header.getSize() + 'px'}
      sx={{ zIndex: pinned ? 1000 : 999 }}
    >
      <Group position="apart">
        <Group spacing="xs">
          <FieldIcon type={field.type} size={14} />
          <Text fz="sm" fw={500}>
            {field.name.value}
          </Text>
        </Group>

        <Group spacing={5}>
          {direction && (
            <Tooltip
              label={
                direction === 'asc'
                  ? (t('Sort By Desending', { ns: 'common' }) as string)
                  : t('Sort By Ascending', { ns: 'common' })
              }
            >
              <ActionIcon
                variant="light"
                sx={{
                  transition: 'transform 320ms ease',
                  ':hover': {
                    transform: 'rotate(180deg)',
                  },
                }}
                onClick={() => {
                  setFieldSort({
                    tableId: table.id.value,
                    viewId: view.id.value,
                    fieldId: field.id.value,
                    direction: direction === 'asc' ? 'desc' : 'asc',
                  })
                }}
              >
                {direction === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />}
              </ActionIcon>
            </Tooltip>
          )}
          <TableUIFieldMenu field={field} index={index} header={header} />
        </Group>
      </Group>

      <Resizer
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        onMouseUp={() => onSetFieldWidth(header.id, header.getSize())}
      >
        <ResizerLine className="line" isResizing={column.getIsResizing()} />
      </Resizer>
    </Box>
  )
})
