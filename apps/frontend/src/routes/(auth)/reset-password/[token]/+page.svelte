<script lang="ts">
  import { goto } from "$app/navigation"
  import * as Card from "$lib/components/ui/card/index.js"
  import { Label } from "$lib/components/ui/label/index.js"
  import Logo from "$lib/images/logo.svg"
  import { createMutation } from "@tanstack/svelte-query"
  import { z } from "@undb/zod"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import PasswordInput from "$lib/components/ui/input/password-input.svelte"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { page } from "$app/stores"

  const schema = z
    .object({
      password: z.string(),
      confirmPassword: z.string(),
    })
    .refine((data) => {
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match")
      }
      return data
    })

  type ResetPasswordSchema = z.infer<typeof schema>

  const resetPasswordMutation = createMutation({
    mutationFn: async (input: ResetPasswordSchema) => {
      const { ok } = await fetch("/api/reset-password/" + $page.params.token, {
        method: "POST",
        body: JSON.stringify({ password: input.password }),
      })
      if (!ok) {
        throw new Error("Failed to reset password")
      }
      return
    },
    async onSuccess(data, variables, context) {
      await goto("/")
    },
  })

  const form = superForm(
    defaults(
      {
        password: "",
        confirmPassword: "",
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

        await $resetPasswordMutation.mutateAsync(event.form.data)
      },
    },
  )
  const { enhance, form: formData } = form
</script>

<section class="w-[450px] -translate-y-20 space-y-5">
  <div class="flex justify-center">
    <img src={Logo} alt="undb" class="h-12 w-12" />
  </div>

  <form method="POST" use:enhance>
    <Card.Root class="mx-auto">
      <Card.Header>
        <Card.Title class="text-2xl">Reset password</Card.Title>
        <Card.Description>Enter your new password to reset your password.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Form.Field {form} name="password">
              <Form.Control let:attrs>
                <div class="flex justify-between">
                  <Label for="password">Password</Label>
                </div>
                <PasswordInput {...attrs} id="password" placeholder="*****" bind:value={$formData.password} />
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
                  placeholder="*****"
                  bind:value={$formData.confirmPassword}
                />
              </Form.Control>
              <Form.Description />
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <Form.Button type="submit" class="w-full" disabled={$resetPasswordMutation.isPending}>
            {#if $resetPasswordMutation.isPending}
              <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
            {/if}
            Reset password
          </Form.Button>
        </div>
      </Card.Content>
    </Card.Root>
  </form>
</section>
