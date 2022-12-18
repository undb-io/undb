import { Button, IconEye, Popover } from '@egodb/ui'
import { trpc } from '../../trpc'

export const TableFieldVisibilityEditor: React.FC = () => {
  const setFieldVisibility = trpc.table.setFieldVisibility.useMutation()
  return (
    <Popover position="bottom-start">
      <Popover.Target>
        <Button variant="white" loading={setFieldVisibility.isLoading} leftIcon={<IconEye size={18} />}>
          Hide Fields
        </Button>
      </Popover.Target>
    </Popover>
  )
}
