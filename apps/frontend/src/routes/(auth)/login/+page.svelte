<script lang="ts">
  import { goto } from "$app/navigation"
  import * as Card from "$lib/components/ui/card/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import { Label } from "$lib/components/ui/label/index.js"
  import Logo from "$lib/images/logo.svg"
  import Github from "$lib/images/github.svg"
  import Google from "$lib/images/Google.svg"
  import { createMutation } from "@tanstack/svelte-query"
  import { z } from "@undb/zod"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Button } from "$lib/components/ui/button"
  import { Separator } from "$lib/components/ui/separator"
  import PasswordInput from "$lib/components/ui/input/password-input.svelte"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import autoAnimate from "@formkit/auto-animate"
  import { LoaderCircleIcon } from "lucide-svelte"
  import ResetPassword from "$lib/components/blocks/auth/reset-password.svelte"

  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  type LoginSchema = z.infer<typeof schema>

  let loginError = false

  const loginMutation = createMutation({
    mutationFn: async (input: LoginSchema) => {
      try {
        const { ok } = await fetch("/api/login", { method: "POST", body: JSON.stringify(input) })
        if (!ok) {
          throw new Error("Failed to login")
        }
        return
      } catch (error) {
        loginError = true
      }
    },
    onMutate(variables) {
      loginError = false
    },
    async onSuccess(data, variables, context) {
      await goto("/")
    },
    async onError(error, variables, context) {
      loginError = true
    },
  })

  const form = superForm(
    defaults(
      {
        email: "",
        password: "",
      },
      zodClient(schema),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(schema),
      resetForm: false,
      invalidateAll: false,
      async onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors)
          return
        }

        await $loginMutation.mutateAsync(event.form.data)
      },
    },
  )
  const { enhance, form: formData } = form

  let resetPassword = false
</script>

<section class="w-[450px] -translate-y-20 space-y-5">
  <div class="flex justify-center">
    <img src={Logo} alt="undb" class="h-12 w-12" />
  </div>

  {#if resetPassword}
    <ResetPassword />
  {:else}
    <form method="POST" use:enhance>
      <Card.Root class="mx-auto">
        <Card.Header>
          <Card.Title class="text-2xl">Undb Login</Card.Title>
          <Card.Description>Enter your email below to login to your account.</Card.Description>
        </Card.Header>
        <Card.Content>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Form.Field {form} name="email">
                <Form.Control let:attrs>
                  <Form.Label for="email">Email</Form.Label>
                  <Input
                    {...attrs}
                    id="email"
                    type="email"
                    placeholder="Enter your email to login"
                    bind:value={$formData.email}
                  />
                </Form.Control>
                <Form.Description />
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <div class="grid gap-2">
              <Form.Field {form} name="password">
                <Form.Control let:attrs>
                  <div class="flex justify-between">
                    <Label for="password">Password</Label>
                    <Button
                      variant="link"
                      class="ml-auto h-auto p-0 text-sm"
                      on:click={() => {
                        resetPassword = true
                      }}>Forgot your password?</Button
                    >
                  </div>
                  <PasswordInput {...attrs} id="password" placeholder="*****" bind:value={$formData.password} />
                </Form.Control>
                <Form.Description />
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <Form.Button type="submit" class="w-full" disabled={$loginMutation.isPending}>
              {#if $loginMutation.isPending}
                <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
              {/if}
              Login
            </Form.Button>
          </div>
          <div class="mt-4" use:autoAnimate>
            {#if loginError}
              <Alert.Root variant="destructive">
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>Invalid email or password.</Alert.Description>
              </Alert.Root>
            {/if}
          </div>
          <div class="mt-4 text-center text-sm">
            Don&apos;t have an account?
            <a href="/signup" class="underline"> Sign up </a>
          </div>
          <Separator class="my-6" />
          <div class="space-y-2">
            <Button href="/login/github" variant="secondary" class="w-full">
              <img class="mr-2 h-4 w-4" src={Github} alt="github" />
              Login with Github
            </Button>
            <Button href="/login/google" variant="secondary" class="w-full">
              <img class="mr-2 h-4 w-4" src={Google} alt="google" />
              Login with Google
            </Button>
          </div>
        </Card.Content>
      </Card.Root>
    </form>
  {/if}
</section>
