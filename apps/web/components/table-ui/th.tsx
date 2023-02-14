import { Group, Text } from '@egodb/ui'
import styled from '@emotion/styled'
import type { TColumn, THeader } from './interface'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Field } from '@egodb/core'
import { memo } from 'react'
import { FieldIcon } from '../field-inputs/field-Icon'
import { HeaderMenu } from './header-menu'
import { useSetFieldWidthMutation } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'

const ResizerLine = styled.div<{ hidden: boolean; isResizing: boolean }>`
  display: ${(props) => (props.hidden ? 'none' : 'block')};
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
    ${ResizerLine} {
      opacity: 1;
    }
  }
`

interface IProps {
  header: THeader
  column: TColumn
  field: Field
}

export const Th: React.FC<IProps> = memo(({ header, field, column }) => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const [setFieldWidth] = useSetFieldWidthMutation()

  const onSetFieldWidth = (fieldId: string, width: number) => {
    setFieldWidth({
      tableId: table.id.value,
      fieldId,
      viewId: view.id.value,
      width,
    })
  }

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.id,
  })
  return (
    <th
      data-field-id={field.id.value}
      key={header.id}
      style={{
        position: 'relative',
        width: header.getSize(),
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: isDragging ? 'grabbing' : undefined,
      }}
    >
      <Group position="apart" ref={setNodeRef} {...attributes} {...listeners}>
        <Group spacing="xs">
          <FieldIcon type={field.type} size={14} />
          <Text fz="sm" fw={500}>
            {field.name.value}
          </Text>
        </Group>

        {!field.system && <HeaderMenu field={field} />}
      </Group>

      <Resizer
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        onMouseUp={() => onSetFieldWidth(header.id, header.getSize())}
      >
        <ResizerLine hidden={isDragging} isResizing={column.getIsResizing()} />
      </Resizer>
    </th>
  )
})
