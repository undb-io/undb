import { useRef, useEffect } from 'react'
import { Accordion, Box } from '@egodb/ui'
import autoAnimate from '@formkit/auto-animate'

import { FieldAccordionItem } from './fields/field-accordion-item'
import { useCreateTableFormContext } from './create-table-form-context'
import { useAtom } from 'jotai'
import { fieldValueAtom } from './create-table-form-schema.atom'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

export const CreateTableFormSchema: React.FC = () => {
  const form = useCreateTableFormContext()
  const [value, setValue] = useAtom(fieldValueAtom)
  const parent = useRef(null)
  useEffect(() => {
    parent.current && autoAnimate(parent.current, { duration: 100 })
  }, [parent])

  const items = form.values.schema.map((_, index) => index + 1)
  return (
    <DndContext
      onDragStart={() => setValue(null)}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Accordion variant="contained" value={value} onChange={setValue}>
          <Box ref={parent}>
            {form.values.schema.map((column, index) => (
              <FieldAccordionItem key={index} index={index} />
            ))}
          </Box>
        </Accordion>
      </SortableContext>
    </DndContext>
  )
}
