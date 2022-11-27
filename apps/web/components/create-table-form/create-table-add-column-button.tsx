import { Button, IconPlus } from '@egodb/ui'
import { useCreateTableFormContext } from './create-table-form-context'

export const CreateTableAddColumnButton: React.FC = () => {
  const form = useCreateTableFormContext()

  return (
    <Button
      onClick={() => {
        form.insertListItem('schema', { type: 'text', name: '' })
      }}
      fullWidth
      color="orange"
      variant="light"
      leftIcon={<IconPlus />}
    >
      Add New Column
    </Button>
  )
}
