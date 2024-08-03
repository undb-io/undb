<script lang="ts">
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button/index.js"
  import * as Card from "$lib/components/ui/card/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import { Label } from "$lib/components/ui/label/index.js"
  import Logo from "$lib/images/logo.svg"
  import { createMutation } from "@tanstack/svelte-query"
  import { z } from "@undb/zod"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { toast } from "svelte-sonner"

  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
    username: z.string().min(2).optional(),
  })

  type SignupSchema = z.infer<typeof schema>

  $: invitationId = $page.url.searchParams.get("invitationId")

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
        email: "",
        password: "",
        username: "",
      },
      zodClient(schema),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(schema),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors)
          return
        }

        $signupMutation.mutate(event.form.data)
      },
    },
  )
  const { enhance, form: formData } = form
</script>

<section class="-translate-y-20 space-y-5">
  <div class="flex justify-center">
    <img src={Logo} alt="undb" class="h-12 w-12" />
  </div>

  <form method="POST" use:enhance>
    <Card.Root class="mx-auto max-w-sm">
      <Card.Header>
        <Card.Title class="text-xl">Sign Up</Card.Title>
        <Card.Description>Enter your information to create an account</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-2">
          <div class="grid gap-2">
            <Form.Field {form} name="username">
              <Form.Control let:attrs>
                <Form.Label for="username">Username</Form.Label>
                <Input {...attrs} placeholder="Username" id="username" bind:value={$formData.username} />
              </Form.Control>
              <Form.Description />
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="grid gap-2">
            <Form.Field {form} name="email">
              <Form.Control let:attrs>
                <Form.Label for="email">Email</Form.Label>
                <Input {...attrs} id="email" type="email" bind:value={$formData.email} />
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
                  <a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
                </div>
                <Input {...attrs} id="password" type="password" bind:value={$formData.password} />
              </Form.Control>
              <Form.Description />
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <Button type="submit" class="w-full">Create an account</Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <a href="/login" class="underline"> Sign in </a>
        </div>
      </Card.Content>
    </Card.Root>
  </form>
</section>
