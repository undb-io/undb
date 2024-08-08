<script lang="ts">
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button/index.js"
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
  import { toast } from "svelte-sonner"
  import { Separator } from "$lib/components/ui/separator"
  import PasswordInput from "$lib/components/ui/input/password-input.svelte"

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

  $: invitationId = $page.url.searchParams.get("invitationId")

  $: showBanner = !!invitationId

  const signupMutation = createMutation({
    mutationFn: (input: SignupSchema) =>
      fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ ...input, invitationId }),
      }),
    async onSuccess(data, variables, context) {
      await goto("/")
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const form = superForm(
    defaults(
      {
        email: $page.url.searchParams.get("email") || "",
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

{#if showBanner}
  <div
    id="sticky-banner"
    tabindex="-1"
    class="fixed start-0 top-0 z-50 flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
  >
    <div class="mx-auto flex items-center">
      <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
        <span
          class="me-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 p-1 dark:bg-gray-600"
        >
          <svg
            class="h-3 w-3 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 19"
          >
            <path
              d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z"
            />
          </svg>
          <span class="sr-only">Light bulb</span>
        </span>
        <span>Create account and accept invitation</span>
      </p>
    </div>
    <div class="flex items-center">
      <button
        on:click={() => (showBanner = false)}
        data-dismiss-target="#sticky-banner"
        type="button"
        class="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span class="sr-only">Close banner</span>
      </button>
    </div>
  </div>
{/if}

<section class="w-[450px] -translate-y-20 space-y-5">
  <div class="flex justify-center">
    <img src={Logo} alt="undb" class="h-12 w-12" />
  </div>

  <form method="POST" use:enhance>
    <Card.Root class="mx-auto">
      <Card.Header>
        <Card.Title class="text-xl">Undb Sign Up</Card.Title>
        <Card.Description>Enter your information to create an account.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-2">
          <div class="grid gap-2">
            <Form.Field {form} name="username">
              <Form.Control let:attrs>
                <Form.Label for="username">Username</Form.Label>
                <Input
                  {...attrs}
                  placeholder="Enter your display username"
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
                <Form.Label for="email">Email</Form.Label>
                <Input
                  {...attrs}
                  id="email"
                  type="email"
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
          <Button {disabled} type="submit" class="w-full">Create an account</Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <a href="/login" class="underline"> Sign in </a>
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
</section>
