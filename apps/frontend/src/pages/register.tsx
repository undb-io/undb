import { useRegisterMutation } from '@egodb/store'
import { Center, Paper, TextInput, PasswordInput, Space, Button, Divider } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { FieldInputLabel } from '../features/field-inputs/field-input-label'

export const Register: React.FC = () => {
  const navigate = useNavigate()
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

  const [register] = useRegisterMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await register(values).unwrap()
    navigate('/', { replace: true })
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
          <Button type="submit" fullWidth disabled={!form.formState.isValid}>
            Register
          </Button>
        </form>

        <Divider label="has account?" labelPosition="center" my="sm" />

        <Center>
          <Link to="/login">
            <Button compact variant="white">
              login
            </Button>
          </Link>
        </Center>
      </Paper>
    </Center>
  )
}
