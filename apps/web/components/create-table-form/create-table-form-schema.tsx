import { useRef, useEffect } from 'react'
import { Accordion, Box } from '@egodb/ui'
import autoAnimate from '@formkit/auto-animate'

import { FieldAccordionItem } from './fields/field-accordion-item'
import { useCreateTableFormContext } from './create-table-form-context'
import { useAtom } from 'jotai'
import { fieldValueAtom } from './create-table-form-schema.atom'

export const CreateTableFormSchema: React.FC = () => {
  const form = useCreateTableFormContext()
  const [value, setValue] = useAtom(fieldValueAtom)
  const parent = useRef(null)
  useEffect(() => {
    parent.current && autoAnimate(parent.current, { duration: 100 })
  }, [parent])

  return (
    <Accordion variant="contained" value={value} onChange={setValue}>
      <Box ref={parent}>
        {form.values.schema.map((column, index) => (
          <FieldAccordionItem key={index} index={index} />
        ))}
      </Box>
    </Accordion>
  )
}
