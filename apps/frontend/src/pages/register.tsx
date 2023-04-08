import { useRegisterMutation } from '@undb/store'
import { Center, Paper, TextInput, PasswordInput, Space, Button, Divider } from '@undb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { FieldInputLabel } from '../features/field-inputs/field-input-label'
import { StringParam, useQueryParam } from 'use-query-params'
import { useTranslation } from 'react-i18next'

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
    <Center h="100vh">
      <Paper shadow="md" p="lg" w={400}>
        <form onSubmit={onSubmit}>
          <TextInput
            type="email"
            {...form.register('email')}
            label={<FieldInputLabel>{t('email', { ns: 'auth' })}</FieldInputLabel>}
            placeholder={t('email placeholder', { ns: 'auth' }) as string}
            error={form.formState.errors.email?.message}
          />
          <PasswordInput
            {...form.register('password')}
            label={<FieldInputLabel>{t('password', { ns: 'auth' })}</FieldInputLabel>}
            placeholder={t('password placeholder', { ns: 'auth' }) as string}
          />
          <Space h="lg" />
          <Button type="submit" fullWidth disabled={!form.formState.isValid} loading={isLoading}>
            {t('register', { ns: 'auth' })}
          </Button>
        </form>

        <Divider label={t('has account', { ns: 'auth' })} labelPosition="center" my="sm" />

        <Center>
          <Link to={{ pathname: '/login', search: location.search }}>
            <Button compact variant="white">
              {t('login', { ns: 'auth' })}
            </Button>
          </Link>
        </Center>
      </Paper>
    </Center>
  )
}
