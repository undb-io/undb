<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import { Label } from "$lib/components/ui/label/index.js"
  import Github from "$lib/images/github.svg"
  import Google from "$lib/images/Google.svg"
  import { createMutation } from "@tanstack/svelte-query"
  import { z } from "@undb/zod"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Separator } from "$lib/components/ui/separator"
  import PasswordInput from "$lib/components/ui/input/password-input.svelte"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { cn } from "$lib/utils"
  import { LL } from "@undb/i18n/client"

  export let redirect: string | null
  export let invitationId: string | null
  export let email: string | null
  export let githubEnabled: boolean
  export let googleEnabled: boolean
  export let onSuccess: () => void = () => {}

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(2).optional(),
  })

  const formSchema = schema
    .merge(
      z.object({
        confirmPassword: z.string(),
      }),
    )
    .refine((data) => data.password === data.confirmPassword, {
      message: $LL.auth.passwordDoesNotMatch(),
    })

  type SignupSchema = z.infer<typeof schema>

  let signupError = false

  const signupMutation = createMutation({
    mutationFn: async (input: SignupSchema) => {
      try {
        const { ok } = await fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify({ ...input, invitationId }),
        })
        if (!ok) {
          throw new Error($LL.auth.registerFailed())
        }
      } catch (error) {
        signupError = true
      }
    },
    onMutate(variables) {
      signupError = false
    },
    async onSuccess(data, variables, context) {
      onSuccess()
    },
    onError(error, variables, context) {
      signupError = true
    },
  })

  const form = superForm(
    defaults(
      {
        email: email || "",
        password: "",
        confirmPassword: "",
        username: "",
      },
      zodClient(formSchema),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(formSchema),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors)
          return
        }

        const { confirmPassword, ...data } = event.form.data
        $signupMutation.mutate(data)
      },
    },
  )
  const { enhance, form: formData, allErrors } = form
  $: disabled = $allErrors.length > 0 || $signupMutation.isPending
</script>

<form method="POST" use:enhance>
  <div class="grid gap-2">
    <div class="grid gap-2">
      <Form.Field {form} name="username">
        <Form.Control let:attrs>
          <Form.Label for="username">{$LL.auth.username()}</Form.Label>
          <Input
            {...attrs}
            placeholder={$LL.auth.enterYourDisplayUsername()}
            id="username"
            bind:value={$formData.username}
          />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid gap-2">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label for="email">
            {$LL.common.email()}
            {#if invitationId}
              <span class="text-green-500"> ({$LL.auth.invited()})</span>
            {/if}
          </Form.Label>
          <Input
            {...attrs}
            disabled={!!invitationId}
            id="email"
            type="email"
            class={cn(!!invitationId && "border-2 border-green-500")}
            placeholder={$LL.auth.enterYourWorkEmail()}
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
            <Form.Label for="password">{$LL.auth.password()}</Form.Label>
          </div>
          <PasswordInput
            {...attrs}
            id="password"
            type="password"
            placeholder="******"
            bind:value={$formData.password}
          />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid gap-2">
      <Form.Field {form} name="confirmPassword">
        <Form.Control let:attrs>
          <div class="flex justify-between">
            <Form.Label for="confirmPassword">{$LL.auth.confirmPassword()}</Form.Label>
          </div>
          <PasswordInput
            {...attrs}
            id="confirmPassword"
            type="password"
            placeholder="******"
            bind:value={$formData.confirmPassword}
          />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <Button {disabled} type="submit" class="w-full">
      {#if $signupMutation.isPending}
        <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
      {/if}
      {$LL.auth.createAnAccount()}
    </Button>
  </div>
  <div class="mt-4 text-center text-sm">
    {$LL.auth.alreadyHaveAnAccount()}
    {#if invitationId}
      <a href={`/login?invitationId=${invitationId}`} class="underline"> {$LL.auth.signIn()}</a>
    {:else if redirect}
      <a href={`/login?redirect=${encodeURIComponent(redirect)}`} class="underline"> {$LL.auth.signIn()}</a>
    {:else}
      <a href="/login" class="underline"> {$LL.auth.signIn()}</a>
    {/if}
  </div>
  {#if !invitationId && (githubEnabled || googleEnabled)}
    <Separator class="my-6" />
    <div class="space-y-2">
      {#if githubEnabled}
        <Button href="/login/github" variant="secondary" class="w-full">
          <img class="mr-2 h-4 w-4" src={Github} alt="github" />
          {$LL.auth.loginWith({ provider: "Github" })}
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
</form>
