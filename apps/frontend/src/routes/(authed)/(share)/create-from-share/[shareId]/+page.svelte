<script lang="ts">
  import { goto } from "$app/navigation"
  import * as Card from "$lib/components/ui/card/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import Logo from "$lib/images/logo.svg"
  import { createMutation } from "@tanstack/svelte-query"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import { LoaderCircleIcon, SirenIcon, Store } from "lucide-svelte"
  import { createFromShareCommand } from "@undb/commands"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { trpc } from "$lib/trpc/client"
  import { page } from "$app/stores"
  import type { PageData } from "./$types"
  import * as Select from "$lib/components/ui/select/index.js"
  import { toast } from "svelte-sonner"
  import * as Dialog from "$lib/components/ui/dialog"
  import { Button } from "$lib/components/ui/button"

  export let data: PageData

  let { shareId } = $page.params
  let store = data.store

  $: spaces = $store.data?.spaces ?? []
  $: space = $store.data?.space
  $: template = $store.data?.template

  $: if (space) {
    form.reset({
      data: {
        shareId,
        targetSpaceId: space.id,
        name: template?.name,
        includeData: true,
      },
    })
  }

  const createFromShareMutation = createMutation({
    mutationFn: trpc.base.createFromShare.mutate,
    onError(error, variables, context) {
      toast.error(error.message)
    },
    async onSuccess(data, variables, context) {
      if ($formData.targetSpaceId) {
        await fetch(`/api/spaces/${$formData.targetSpaceId}/goto`)
      }
      await goto("/")
    },
  })

  const form = superForm(
    defaults(
      {
        shareId,
        targetSpaceId: space?.id,
        name: template?.name,
        includeData: true,
      },
      zodClient(createFromShareCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createFromShareCommand),
      resetForm: false,
      invalidateAll: false,
      onSubmit(input) {
        validateForm()
      },
      async onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors)
          return
        }

        await $createFromShareMutation.mutateAsync(event.form.data)
      },
    },
  )
  const { enhance, form: formData, validateForm } = form

  $: selectedSpace = $formData.targetSpaceId
    ? {
        label: spaces.find((space) => space?.id === $formData.targetSpaceId)?.name,
        value: $formData.targetSpaceId,
      }
    : undefined
</script>

<section class="w-[450px] -translate-y-20 space-y-5">
  <div class="flex justify-center">
    <img src={Logo} alt="undb" class="h-12 w-12" />
  </div>

  <form method="POST" use:enhance>
    <Card.Root class="mx-auto">
      <Card.Header>
        <Card.Title class="text-2xl">Create from share</Card.Title>
        <Card.Description>Create a new base from a shared base.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-2">
          <div class="grid gap-2">
            <Form.Field {form} name="name">
              <Form.Control let:attrs>
                <Form.Label for="name">Name</Form.Label>
                <div class="flex items-center gap-2">
                  <Input
                    {...attrs}
                    id="name"
                    type="name"
                    class="flex-1"
                    placeholder="Enter new base name"
                    bind:value={$formData.name}
                  />
                  <Dialog.Root>
                    <Dialog.Trigger asChild let:builder>
                      <Button builders={[builder]} variant="secondary" class="text-sm">Preview</Button>
                    </Dialog.Trigger>
                    <Dialog.Content class="sm:max-w-3/4 max-w-3/4 z-[100] h-[800px] !w-1/2 gap-0 space-y-0 p-0">
                      <iframe src={"/s/b/" + shareId} class="h-full w-full" title={template?.name}></iframe>
                    </Dialog.Content>
                  </Dialog.Root>
                </div>
              </Form.Control>
              <Form.Description />
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <Form.Field {form} name="targetSpaceId">
            <Form.Control let:attrs>
              <Form.Label>Space</Form.Label>
              <Select.Root
                selected={selectedSpace}
                onSelectedChange={(v) => {
                  v && ($formData.targetSpaceId = v.value)
                }}
              >
                <Select.Trigger {...attrs}>
                  <Select.Value placeholder="Select a space" />
                </Select.Trigger>
                <Select.Content>
                  {#each spaces as space}
                    <Select.Item value={space?.id} label={space?.name} />
                  {/each}
                </Select.Content>
              </Select.Root>
              <input hidden bind:value={$formData.targetSpaceId} name={attrs.name} />
            </Form.Control>
            <Form.Description>Select a space to create the new base in.</Form.Description>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field
            {form}
            name="includeData"
            class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
          >
            <Form.Control let:attrs>
              <Checkbox {...attrs} bind:checked={$formData.includeData} />
              <div class="space-y-1 leading-none">
                <Form.Label>Include data</Form.Label>
                <Form.Description>Include data in the new base.</Form.Description>
              </div>
              <input name={attrs.name} value={$formData.includeData} hidden />
            </Form.Control>
          </Form.Field>

          <Alert.Root>
            <Alert.Description class="flex items-center text-xs">
              <SirenIcon class="mr-2 h-4 w-4" />
              System fields will be updated to the current user and timestamp.
            </Alert.Description>
          </Alert.Root>
          <Form.Button type="submit" class="w-full" disabled={$createFromShareMutation.isPending}>
            {#if $createFromShareMutation.isPending}
              <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
            {/if}
            Create
          </Form.Button>
        </div>
      </Card.Content>
    </Card.Root>
  </form>
</section>
