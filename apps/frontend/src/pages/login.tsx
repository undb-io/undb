import {
  Button,
  Center,
  Divider,
  IconMail,
  IconPassword,
  IconUser,
  Image,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  ThemeIcon,
  Title,
  notifications,
} from '@undb/ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import logo from '../assets/logo.svg'
import { useLoginMutation } from '@undb/store'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import { useTranslation } from 'react-i18next'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { t } = useTranslation()

  const [redirectUrl] = useQueryParam('redirectUrl', StringParam)

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

  const [login, { isLoading }] = useLoginMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values).unwrap()
      navigate(redirectUrl || '/', { replace: true })
    } catch (error) {
      const data = (error as any).data
      if (data) {
        const message = data.code ? t(data.code, { ns: 'error' }) : data.message
        notifications.show({
          color: 'red',
          title: t('error', { ns: 'common' }),
          message,
        })
      }
    }
  })

  return (
    <Center
      h="100vh"
      sx={(theme) => ({
        background: theme.fn.gradient(),
      })}
    >
      <Stack>
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
                  {t('login to undb', { ns: 'auth' })}
                </Title>
              </Center>
              <TextInput
                type="email"
                {...form.register('email')}
                radius="xl"
                h={40}
                mb="xs"
                size="md"
                variant="filled"
                icon={<IconMail size={16} />}
                placeholder={t('email placeholder', { ns: 'auth' }) as string}
              />
              <PasswordInput
                {...form.register('password')}
                radius="xl"
                size="md"
                mb="xs"
                icon={<IconPassword size={16} />}
                placeholder={t('password placeholder', { ns: 'auth' }) as string}
                variant="filled"
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
                {t('login', { ns: 'auth' })}
              </Button>
              <Divider label={t('has no account', { ns: 'auth' })} labelPosition="center" my="sm" />
              <Center>
                <Link to={{ pathname: '/register', search: location.search }}>
                  <Button compact variant="white">
                    {t('register', { ns: 'auth' })}
                  </Button>
                </Link>
              </Center>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Center>
  )
}

export default Login
