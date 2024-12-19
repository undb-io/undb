<script lang="ts">
  import { goto } from "$app/navigation"
  import { Input } from "$lib/components/ui/input/index.js"
  import { Label } from "$lib/components/ui/label/index.js"
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
  import { LL } from "@undb/i18n/client"
  import { page } from "$app/stores"

  export let registrationEnabled: boolean
  export let redirect: string | null
  export let onSuccess: () => void = () => {}
  export let githubEnabled: boolean
  export let googleEnabled: boolean
  export let otpEnabled: boolean

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
          throw new Error($LL.auth.loginFailed())
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
      onSuccess()
    },
    async onError(error, variables, context) {
      loginError = true
    },
  })

  const form = superForm(
    defaults(
      {
        email: $page.url.searchParams.get("email") ?? "",
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

{#if resetPassword}
  <ResetPassword />
{:else}
  <form method="POST" use:enhance>
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Form.Field {form} name="email">
          <Form.Control let:attrs>
            <Form.Label for="email">{$LL.common.email()}</Form.Label>
            <Input
              {...attrs}
              id="email"
              type="email"
              placeholder={$LL.auth.emailPlaceholder()}
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
              <Label for="password">{$LL.auth.password()}</Label>
              <Button
                tabindex={-1}
                variant="link"
                class="ml-auto h-auto p-0 text-sm"
                on:click={() => {
                  resetPassword = true
                }}>{$LL.auth.forgotPassword()}</Button
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
        {$LL.auth.login()}
      </Form.Button>
    </div>
    <div class="mt-4" use:autoAnimate>
      {#if loginError}
        <Alert.Root variant="destructive">
          <Alert.Title>{$LL.common.error()}</Alert.Title>
          <Alert.Description>{$LL.auth.invalidEmailOrPassword()}</Alert.Description>
        </Alert.Root>
      {/if}
    </div>
    {#if registrationEnabled}
      <div class="mt-4 text-center text-sm">
        {$LL.auth.noAccount()}
        {#if redirect}
          <a href="/signup?redirect={encodeURIComponent(redirect)}" class="underline"> {$LL.auth.register()}</a>
        {:else}
          <a href="/signup" class="underline"> {$LL.auth.register()}</a>
        {/if}
      </div>
    {:else}
      <p class="text-muted-foreground mt-4 text-center text-xs">
        {$LL.auth.registerDisabled()}

        <br />
        {$LL.auth.registerDisabledDescription()}
      </p>
    {/if}
    {#if githubEnabled || googleEnabled}
      <Separator class="my-6" />
      <div class="space-y-2">
        {#if githubEnabled}
          <Button href="/login/github" variant="secondary" class="w-full">
            <img class="mr-2 h-4 w-4" src={Github} alt="github" />
            {$LL.auth.loginWith({ provider: "GitHub" })}
          </Button>
        {/if}
        {#if googleEnabled}
          <Button href="/login/google" variant="secondary" class="w-full">
            <img class="mr-2 h-4 w-4" src={Google} alt="google" />
            {$LL.auth.loginWith({ provider: "Google" })}
          </Button>
        {/if}
      </div>
    {/if}
    {#if otpEnabled}
      <Button href="/login-with-otp" variant="link" class="mt-4 w-full" size="xs">
        {$LL.auth.loginWith({ provider: "One-time password" })}
      </Button>
    {/if}
  </form>
{/if}
