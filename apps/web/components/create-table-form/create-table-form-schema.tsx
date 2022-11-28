import { Accordion, Box } from '@egodb/ui'
import autoAnimate from '@formkit/auto-animate'

import { FieldAccordion } from '../fields/field-accordion'
import { useCreateTableFormContext } from './create-table-form-context'
import { useRef, useEffect } from 'react'

export const CreateTableFormSchema: React.FC = () => {
  const form = useCreateTableFormContext()
  const parent = useRef(null)
  useEffect(() => {
    parent.current && autoAnimate(parent.current, { duration: 100 })
  }, [parent])

  return (
    <Accordion>
      <Box ref={parent}>
        {form.values.schema.map((column, index) => {
          return <FieldAccordion key={column.name} index={index} />
        })}
      </Box>
    </Accordion>
  )
}
