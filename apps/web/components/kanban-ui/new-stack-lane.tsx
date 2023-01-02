import { Button, IconPlus } from '@egodb/ui'

export const NewStackLane: React.FC = () => {
  return (
    <Button w={300} variant="white" leftIcon={<IconPlus />}>
      New Stack
    </Button>
  )
}
