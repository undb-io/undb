<script lang="ts">
  import { goto } from "$app/navigation"
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
  import { Button } from "$lib/components/ui/button"
  import { Separator } from "$lib/components/ui/separator"
  import { GithubIcon } from "lucide-svelte"

  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  type LoginSchema = z.infer<typeof schema>

  const loginMutation = createMutation({
    mutationFn: (input: LoginSchema) => fetch("/api/login", { method: "POST", body: JSON.stringify(input) }),
    async onSuccess(data, variables, context) {
      await goto("/")
    },
    async onError(error, variables, context) {
      toast.error(error.message)
      await goto("/signup")
    },
    onSettled(data, error, variables, context) {
      console.log(data)
      console.log(error)
    },
  })

  const form = superForm(
    defaults(
      {
        email: "",
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
</script>

<section class="w-[450px] -translate-y-20 space-y-5">
  <div class="flex justify-center">
    <img src={Logo} alt="undb" class="h-12 w-12" />
  </div>

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
                  <a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
                </div>
                <Input {...attrs} id="password" type="password" placeholder="*****" bind:value={$formData.password} />
              </Form.Control>
              <Form.Description />
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <Form.Button type="submit" class="w-full">Login</Form.Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <a href="/signup" class="underline"> Sign up </a>
        </div>
        <Separator class="my-6" />
        <div>
          <Button href="/login/github" variant="secondary" class="w-full">
            <GithubIcon class="mr-2 h-5 w-5" />
            Login with Github
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  </form>
</section>
