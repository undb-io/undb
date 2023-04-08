import { Button, Center, Divider, Paper, PasswordInput, Space, TextInput } from '@egodb/ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FieldInputLabel } from '../features/field-inputs/field-input-label'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLoginMutation } from '@egodb/store'
import { Link } from 'react-router-dom'

export const Login: React.FC = () => {
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

  const [login] = useLoginMutation()

  const onSubmit = form.handleSubmit((values) => {
    login(values)
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
            Login
          </Button>
        </form>

        <Divider label="or" labelPosition="center" my="sm" />

        <Center>
          <Link to="/register">
            <Button compact variant="white">
              register
            </Button>
          </Link>
        </Center>
      </Paper>
    </Center>
  )
}
