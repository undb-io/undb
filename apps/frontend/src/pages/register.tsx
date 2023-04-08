import { useRegisterMutation } from '@egodb/store'
import { Center, Paper, TextInput, PasswordInput, Space, Button, Divider } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { FieldInputLabel } from '../features/field-inputs/field-input-label'
import { StringParam, useQueryParam } from 'use-query-params'

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
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
            label={<FieldInputLabel>email</FieldInputLabel>}
            placeholder="email"
            error={form.formState.errors.email?.message}
          />
          <PasswordInput
            {...form.register('password')}
            label={<FieldInputLabel>password</FieldInputLabel>}
            placeholder="password"
          />
          <Space h="lg" />
          <Button type="submit" fullWidth disabled={!form.formState.isValid} loading={isLoading}>
            Register
          </Button>
        </form>

        <Divider label="has account?" labelPosition="center" my="sm" />

        <Center>
          <Link to={{ pathname: '/login', search: location.search }}>
            <Button compact variant="white">
              login
            </Button>
          </Link>
        </Center>
      </Paper>
    </Center>
  )
}
