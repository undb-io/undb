import type { Table } from '@egodb/core'
import { Button, Divider, Group } from '@egodb/ui'

interface IProps {
  table: Table
  onCancel: () => void
  onSuccess?: () => void
}

export const EditRecordForm: React.FC<IProps> = ({ table, onCancel, onSuccess }) => {
  return (
    <form>
      <Divider my="lg" />

      <Group position="right">
        <Button variant="subtle" onClick={() => onCancel()}>
          Cancel
        </Button>

        <Button miw={200} type="submit">
          Confirm
        </Button>
      </Group>
    </form>
  )
}
