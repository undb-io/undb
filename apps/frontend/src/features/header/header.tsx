import { ActionIcon, Center, Group, IconLanguage, Image, Menu, Text, Avatar } from '@undb/ui'
import logo from '../../assets/logo.svg'
import { useTranslation } from 'react-i18next'
import { getMe } from '@undb/store'
import { useSelector } from 'react-redux'

export const Header: React.FC = () => {
  const { i18n } = useTranslation()
  const language = i18n.language
  const me = useSelector(getMe)

  return (
    <Group px="xs" py={6} sx={(theme) => ({ borderBottom: '1px solid ' + theme.colors.gray[3] })} position="apart">
      <Center>
        <Image src={logo} alt="undb" width="20px" height="20px" />
        <Text pl="xs">undb</Text>
      </Center>

      <Center mr="lg">
        <Menu>
          <Menu.Target>
            <ActionIcon>
              <IconLanguage />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item fw={language === 'zh-CN' ? 600 : 'normal'} onClick={() => i18n.changeLanguage('zh-CN')}>
              简体中文
            </Menu.Item>
            <Menu.Item fw={language === 'en' ? 600 : 'normal'} onClick={() => i18n.changeLanguage('en')}>
              English
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Avatar radius="xl" ml="sm">
          {me?.username.slice(0, 2).toUpperCase()}
        </Avatar>
      </Center>
    </Group>
  )
}
