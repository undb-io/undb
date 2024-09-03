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
  import { page } from "$app/stores"
  import { env } from "$env/dynamic/public"

  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  type LoginSchema = z.infer<typeof schema>

  let loginError = false

  $: invitationId = $page.url.searchParams.get("invitationId")
  $: redirect = $page.url.searchParams.get("redirect")

  $: showBanner = !!invitationId

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
      if (redirect) {
        await goto(redirect)
      } else {
        await goto("/")
      }
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
        <span>Login to your account and accept the invitation</span>
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
                      tabindex={-1}
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
            {#if redirect}
              <a href="/signup?redirect={encodeURIComponent(redirect)}" class="underline"> Sign up </a>
            {:else}
              <a href="/signup" class="underline"> Sign up </a>
            {/if}
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
