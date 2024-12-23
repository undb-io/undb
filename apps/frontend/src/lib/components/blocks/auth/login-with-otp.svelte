<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js"
  import { createMutation } from "@tanstack/svelte-query"
  import { z } from "@undb/zod"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"

  export let onSuccess: () => void = () => {}

  const schema = z.object({
    email: z.string().email(),
  })

  type sendOtpSchema = z.infer<typeof schema>

  let loginError = false

  const sendOtpMutation = createMutation({
    mutationFn: async (input: sendOtpSchema) => {
      try {
        const { ok } = await fetch("/api/auth/otp/request", { method: "POST", body: JSON.stringify(input) })
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
      await goto(`/verify-otp?email=${variables.email}`)
    },
    async onError(error, variables, context) {
      loginError = true
    },
  })

  const form = superForm(
    defaults(
      {
        email: $page.url.searchParams.get("email") ?? "",
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

        await $sendOtpMutation.mutateAsync(event.form.data)
      },
    },
  )
  const { enhance, form: formData, allErrors } = form
</script>

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
    <Form.Button type="submit" class="w-full" disabled={$sendOtpMutation.isPending || $allErrors.length > 0}>
      {#if $sendOtpMutation.isPending}
        <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
      {/if}
      {$LL.auth.sendOtpCode()}
    </Form.Button>
  </div>
</form>
