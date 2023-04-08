import { Button, Center, Divider, Paper, PasswordInput, Space, TextInput } from '@egodb/ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FieldInputLabel } from '../features/field-inputs/field-input-label'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLoginMutation } from '@egodb/store'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'

export const Login: React.FC = () => {
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

  const [login, { isLoading }] = useLoginMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await login(values).unwrap()
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
            Login
          </Button>
        </form>

        <Divider label="or" labelPosition="center" my="sm" />

        <Center>
          <Link to={{ pathname: '/register', search: location.search }}>
            <Button compact variant="white">
              register
            </Button>
          </Link>
        </Center>
      </Paper>
    </Center>
  )
}
