import { Group, Text } from '@egodb/ui'
import { flexRender } from '@tanstack/react-table'
import styled from '@emotion/styled'
import type { THeader } from './interface'
import { trpc } from '../../trpc'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  const setFieldWidth = trpc.table.view.field.setWidth.useMutation()

  const onSetFieldWidth = (fieldName: string, width: number) => {
    setFieldWidth.mutate({
      tableId,
      fieldName,
      width,
    })
  }

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.id,
  })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <th
      ref={setNodeRef}
      key={header.id}
      style={{
        position: 'relative',
        width: header.getSize(),
        zIndex: isDragging ? 100 : undefined,
        cursor: isDragging ? 'grabbing' : undefined,
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
