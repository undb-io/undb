import { Group, Text, useEgoUITheme } from '@egodb/ui'
import { flexRender } from '@tanstack/react-table'
import styled from '@emotion/styled'
import type { THeader } from './interface'
import { trpc } from '../../trpc'
import { useDraggable, useDroppable } from '@dnd-kit/core'

const ResizerLine = styled.div<{ hidden: boolean }>`
  display: ${(props) => (props.hidden ? 'none' : 'block')};
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

export const Th: React.FC<{ header: THeader; tableId: string }> = ({ header, tableId }) => {
  const setFieldWidth = trpc.table.setFieldWidth.useMutation()
  const theme = useEgoUITheme()

  const onSetFieldWidth = (fieldName: string, width: number) => {
    setFieldWidth.mutate({
      tableId,
      fieldName,
      width,
    })
  }

  const { isOver, setNodeRef: setDroppableRef, over, active } = useDroppable({ id: header.id })
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: header.id,
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined
  return (
    <th
      ref={(ref) => {
        setDraggableRef(ref)
        setDroppableRef(ref)
      }}
      key={header.id}
      style={{
        position: 'relative',
        width: header.getSize(),
        color: isOver && over?.id !== active?.id ? theme.colors.gray[2] : theme.colors.gray[7],
        zIndex: isDragging ? 100 : undefined,
        ...style,
      }}
      colSpan={header.colSpan}
      {...attributes}
    >
      <Group {...listeners}>
        <Text fz="sm" fw={500}>
          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        </Text>
      </Group>
      <Resizer
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        onMouseUp={() => onSetFieldWidth(header.id, header.getSize())}
      >
        <ResizerLine hidden={isDragging} />
      </Resizer>
    </th>
  )
}
