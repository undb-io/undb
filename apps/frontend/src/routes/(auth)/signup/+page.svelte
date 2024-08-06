<script lang="ts">
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button/index.js"
  import * as Card from "$lib/components/ui/card/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import { Label } from "$lib/components/ui/label/index.js"
  import Logo from "$lib/images/logo.svg"
  import Github from "$lib/images/github.svg"
  import { createMutation } from "@tanstack/svelte-query"
  import { z } from "@undb/zod"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { toast } from "svelte-sonner"
  import { Separator } from "$lib/components/ui/separator"

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
  $: disabled = $allErrors.length > 0
</script>

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
                <Input {...attrs} id="password" type="password" placeholder="******" bind:value={$formData.password} />
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
                <Input
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
            <img class="mr-2 h-5 w-5" src={Github} alt="github" />
            Login with Github
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  </form>
</section>
