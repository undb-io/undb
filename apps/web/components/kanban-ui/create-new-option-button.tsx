import { Button, IconPlus } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { createNewOptionOpened } from './create-new-option.atom'

export const CreateNewOptionButton: React.FC = () => {
  const setOpened = useSetAtom(createNewOptionOpened)

  return (
    <Button onClick={() => setOpened(true)} w={300} variant="white" leftIcon={<IconPlus />}>
      New Stack
    </Button>
  )
}
