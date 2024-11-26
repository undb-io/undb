<script lang="ts">
  import { goto } from "$app/navigation"
  import * as Card from "$lib/components/ui/card/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import { createMutation } from "@tanstack/svelte-query"
  import { z } from "@undb/zod"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { LoaderCircleIcon } from "lucide-svelte"
  import * as Alert from "$lib/components/ui/alert"
  import { LL } from "@undb/i18n/client"

  const schema = z.object({
    email: z.string().email(),
  })

  type RestPasswordSchema = z.infer<typeof schema>

  const resetPasswordMutation = createMutation({
    mutationFn: async (input: RestPasswordSchema) => {
      const { ok } = await fetch("/api/reset-password", { method: "POST", body: JSON.stringify(input) })
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
        email: "",
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
  const { enhance, form: formData, tainted } = form
</script>

{#if $resetPasswordMutation.isSuccess}
  <Alert.Root>
    <Alert.Title>{$LL.auth.emailSent()}</Alert.Title>
    <Alert.Description>{$LL.auth.youCanCheckYourEmailAddressAndFollowTheStepsToResetYourPassword()}</Alert.Description>
  </Alert.Root>
{:else}
  <form method="POST" use:enhance>
    <Card.Root class="mx-auto">
      <Card.Header>
        <Card.Title class="text-2xl">{$LL.auth.resetPassword()}</Card.Title>
        <Card.Description>{$LL.auth.enterYourEmailBelowToResetYourPassword()}</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Form.Field {form} name="email">
              <Form.Control let:attrs>
                <Form.Label for="email">{$LL.common.email()}</Form.Label>
                <Input
                  {...attrs}
                  id="email"
                  type="email"
                  placeholder={$LL.auth.enterYourEmailBelowToResetYourPassword()}
                  bind:value={$formData.email}
                />
              </Form.Control>
              <Form.Description />
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <Form.Button type="submit" class="w-full" disabled={$resetPasswordMutation.isPending || !$tainted}>
            {#if $resetPasswordMutation.isPending}
              <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
            {/if}
            {$LL.auth.resetPassword()}
          </Form.Button>
        </div>
      </Card.Content>
    </Card.Root>
  </form>
{/if}
