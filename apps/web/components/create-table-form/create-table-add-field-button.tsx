import { Button, IconPlus } from '@egodb/ui'
import { useCreateTableFormContext } from './create-table-form-context'

export const CreateTableAddFieldButton: React.FC = () => {
  const form = useCreateTableFormContext()
  const len = form.values.schema.length
  const hasSchema = len > 0

  return (
    <Button
      onClick={() => {
        form.insertListItem('schema', { id: '', type: 'string', name: '' })
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
