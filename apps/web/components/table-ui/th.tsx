import { Box, Text, UnstyledButton } from '@egodb/ui'
import { flexRender } from '@tanstack/react-table'
import styled from '@emotion/styled'
import type { THeader } from './interface'
import { trpc } from '../../trpc'
import { ACTIONS_FIELD } from '../../constants/field.constants'
import { AddFieldButton } from '../table/add-field.button'

const ResizerLine = styled.div`
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 2px;
  background-color: #2d7ff9;
  opacity: 0;
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
    ${ResizerLine} {
      opacity: 1;
    }
  }
`

const Content: React.FC<{ header: THeader; tableId: string }> = ({ header, tableId }) => {
  const setFieldWidth = trpc.table.setFieldWidth.useMutation()

  const onSetFieldWidth = (fieldName: string, width: number) => {
    setFieldWidth.mutate({
      tableId,
      fieldName,
      width,
    })
  }

  if (header.id === ACTIONS_FIELD) {
    return (
      <Box px="xs">
        <AddFieldButton />
      </Box>
    )
  }

  return (
    <>
      <UnstyledButton
        w="100%"
        h={45}
        px="lg"
        sx={(theme) => ({
          ':hover': { backgroundColor: theme.colors.gray[2] },
        })}
      >
        {header.id === ACTIONS_FIELD && <AddFieldButton />}
        <Text fz="sm" color="gray.7" fw={500}>
          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        </Text>
      </UnstyledButton>
      <Resizer
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        onMouseUp={() => onSetFieldWidth(header.id, header.getSize())}
      >
        <ResizerLine />
      </Resizer>
    </>
  )
}

export const Th: React.FC<{ header: THeader; tableId: string }> = ({ header, tableId }) => {
  return (
    <th key={header.id} style={{ position: 'relative', width: header.getSize() }} colSpan={header.colSpan}>
      <Content tableId={tableId} header={header} />
    </th>
  )
}
