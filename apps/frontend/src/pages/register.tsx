import { useRegisterMutation } from '@undb/store'
import {
  Center,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Divider,
  ThemeIcon,
  IconUser,
  Stack,
  Image,
  Title,
  IconMail,
  IconPassword,
} from '@undb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { StringParam, useQueryParam } from 'use-query-params'
import { useTranslation } from 'react-i18next'
import logo from '../assets/logo.svg'

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [redirectUrl] = useQueryParam('redirectUrl', StringParam)

  const { t } = useTranslation()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    ),
    shouldUseNativeValidation: false,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const [register, { isLoading }] = useRegisterMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await register(values).unwrap()
    navigate(redirectUrl || '/', { replace: true })
  })

  return (
    <Center
      h="100vh"
      sx={(theme) => ({
        background: theme.fn.gradient(),
      })}
    >
      <Paper shadow="lg" p={40} w={500} radius="lg" pos="relative">
        <ThemeIcon
          w={60}
          h={60}
          bg="white"
          color="blue.9"
          variant="outline"
          radius="xl"
          pos="absolute"
          left="50%"
          top={0}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <IconUser size="2.0rem" />
        </ThemeIcon>

        <form onSubmit={onSubmit}>
          <Stack spacing="xl">
            <Center mb="sm">
              <Image mr="xs" src={logo} alt="undb" width="20px" height="20px" />

              <Title align="center" order={2} color="blue" gradient={{ from: 'indigo', to: 'cyan' }}>
                {t('register to undb', { ns: 'auth' })}
              </Title>
            </Center>

            <TextInput
              type="email"
              {...form.register('email')}
              placeholder={t('email placeholder', { ns: 'auth' }) as string}
              radius="xl"
              h={40}
              mb="xs"
              size="md"
              icon={<IconMail size={16} />}
              variant="filled"
            />
            <PasswordInput
              {...form.register('password')}
              radius="xl"
              size="md"
              mb="xs"
              variant="filled"
              icon={<IconPassword size={16} />}
              placeholder={t('password placeholder', { ns: 'auth' }) as string}
            />
            <Button
              type="submit"
              fullWidth
              disabled={!form.formState.isValid}
              loading={isLoading}
              radius="lg"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              sx={(theme) => ({ boxShadow: theme.shadows.lg })}
            >
              {t('register', { ns: 'auth' })}
            </Button>

            <Divider label={t('has account', { ns: 'auth' })} labelPosition="center" my="sm" />

            <Center>
              <Link to={{ pathname: '/login', search: location.search }}>
                <Button compact variant="white">
                  {t('login', { ns: 'auth' })}
                </Button>
              </Link>
            </Center>
          </Stack>
        </form>
      </Paper>
    </Center>
  )
}

export default Register
