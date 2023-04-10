import { Avatar, Center, Text } from '@undb/ui'

interface IProps {
  values: (string | null)[]
}

export const CollaboratorValue: React.FC<IProps> = ({ values }) => {
  const [username] = values

  return (
    <Center>
      <Avatar size="xs">{username?.slice(0, 2)}</Avatar>
      <Text ml="xs">{username}</Text>
    </Center>
  )
}
