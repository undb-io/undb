import { useEffect, useState } from 'react'
import { Accordion, usePrevious } from '@egodb/ui'
import { FieldAccordionItem } from './fields/field-accordion-item'
import { useCreateTableFormContext } from './create-table-form-context'
import { useAtom } from 'jotai'
import { activeFieldAtom } from './create-table-form-schema.atom'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useResetAtom } from 'jotai/utils'

export const CreateTableFormSchema: React.FC = () => {
  const form = useCreateTableFormContext()
  const [activeField, setActiveField] = useAtom(activeFieldAtom)
  const resetActiveField = useResetAtom(activeFieldAtom)

  const len = form.values.schema.length
  const prevLen = usePrevious(len)

  const [duration, setDuration] = useState(100)

  useEffect(() => {
    if (len && len >= (prevLen || 0)) {
      const id = form.values.schema[len - 1]?.id
      if (id) {
        setActiveField(id)
      }
    }
  }, [len])

  const items = form.values.schema.map((field) => field.id)
  return (
    <DndContext
      onDragStart={() => {
        setDuration(0)
        resetActiveField()
      }}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={(e) => {
        setDuration(100)
        const { over, active } = e
        if (over) {
          form.reorderListItem('schema', {
            from: active.data.current?.sortable.index,
            to: over?.data.current?.sortable.index,
          })
        }
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Accordion value={activeField} onChange={setActiveField} transitionDuration={duration}>
          {form.values.schema.map((field, index) => (
            <FieldAccordionItem key={field.id} index={index} id={field.id} />
          ))}
        </Accordion>
      </SortableContext>
    </DndContext>
  )
}
