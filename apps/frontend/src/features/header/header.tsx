import { Center, Group, Image, Text } from '@egodb/ui'
import logo from '../../assets/logo.svg'

export const Header: React.FC = () => {
  return (
    <Group px="xs" py={6} sx={(theme) => ({ borderBottom: '1px solid ' + theme.colors.gray[3] })}>
      <Center>
        <Image src={logo} alt="egodb" width="20px" height="20px" />
        <Text pl="xs">egodb</Text>
      </Center>
    </Group>
  )
}
