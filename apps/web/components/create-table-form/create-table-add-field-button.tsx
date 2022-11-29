import { Button, IconPlus } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useCreateTableFormContext } from './create-table-form-context'
import { fieldValueAtom } from './create-table-form-schema.atom'

export const CreateTableAddColumnButton: React.FC = () => {
  const form = useCreateTableFormContext()
  const len = form.values.schema.length
  const hasSchema = len > 0
  const [, setValue] = useAtom(fieldValueAtom)

  return (
    <Button
      onClick={() => {
        form.insertListItem('schema', { type: 'text', name: '' })
        setValue(String(len))
      }}
      fullWidth
      color={hasSchema ? 'gray' : 'orange'}
      variant={hasSchema ? 'white' : 'light'}
      leftIcon={<IconPlus />}
    >
      Add New Column
    </Button>
  )
}
