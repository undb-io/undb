import type { ICreateTableInput } from '@egodb/core'
import { FieldId } from '@egodb/core'
import { Button, IconPlus } from '@egodb/ui'
import { useFieldArray, useFormContext } from 'react-hook-form'

export const CreateTableAddFieldButton: React.FC = () => {
  const form = useFormContext<ICreateTableInput>()
  const { append } = useFieldArray<ICreateTableInput>({
    name: 'schema',
  })
  const len = form.watch('schema').length
  const hasSchema = len > 0

  return (
    <Button
      onClick={() => {
        append({ id: FieldId.createId(), type: 'string', name: '' })
      }}
      fullWidth
      color={hasSchema ? 'gray' : 'orange'}
      variant={hasSchema ? 'white' : 'light'}
      leftIcon={<IconPlus />}
    >
      Add New Field
    </Button>
  )
}
