import { Button, IconPlus } from '@egodb/ui'
import { ColumnId } from '@egodb/core'
import { useCreateTableFormContext } from './create-table-form-context'

export const CreateTableAddColumnButton: React.FC = () => {
  const form = useCreateTableFormContext()
  const len = form.values.schema.length
  const hasSchema = len > 0

  return (
    <Button
      onClick={() => {
        const id = ColumnId.create().value
        form.insertListItem('schema', { id, type: 'text', name: '' })
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
