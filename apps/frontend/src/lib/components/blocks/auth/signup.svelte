<script lang="ts">
  import { goto } from "$app/navigation"
  import { Button } from "$lib/components/ui/button/index.js"
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
  import { Separator } from "$lib/components/ui/separator"
  import PasswordInput from "$lib/components/ui/input/password-input.svelte"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { cn } from "$lib/utils"

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
      message: "Passwords do not match",
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
          throw new Error("Failed to signup")
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
          <Form.Label for="username">Username</Form.Label>
          <Input {...attrs} placeholder="Enter your display username" id="username" bind:value={$formData.username} />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid gap-2">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label for="email"
            >Email
            {#if invitationId}
              <span class="text-green-500"> (Invited)</span>
            {/if}
          </Form.Label>
          <Input
            {...attrs}
            disabled={!!invitationId}
            id="email"
            type="email"
            class={cn(!!invitationId && "border-2 border-green-500")}
            placeholder="Enter your work email"
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
            <Label for="confirmPassword">Confirm Password</Label>
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
      Create an account
    </Button>
  </div>
  <div class="mt-4 text-center text-sm">
    Already have an account?
    {#if invitationId}
      <a href={`/login?invitationId=${invitationId}`} class="underline"> Sign in </a>
    {:else if redirect}
      <a href={`/login?redirect=${encodeURIComponent(redirect)}`} class="underline"> Sign in </a>
    {:else}
      <a href="/login" class="underline"> Sign in </a>
    {/if}
  </div>
  {#if !invitationId && (githubEnabled || googleEnabled)}
    <Separator class="my-6" />
    <div class="space-y-2">
      {#if githubEnabled}
        <Button href="/login/github" variant="secondary" class="w-full">
          <img class="mr-2 h-4 w-4" src={Github} alt="github" />
          Login with Github
        </Button>
      {/if}
      {#if googleEnabled}
        <Button href="/login/google" variant="secondary" class="w-full">
          <img class="mr-2 h-4 w-4" src={Google} alt="google" />
          Login with Google
        </Button>
      {/if}
    </div>
  {/if}
</form>
