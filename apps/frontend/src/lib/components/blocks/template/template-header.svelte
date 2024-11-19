<script lang="ts">
  import type { ITemplateDTO } from "@undb/template"
  import Logo from "$lib/images/logo.svg"
  import { Button } from "$lib/components/ui/button"
  import { LoaderCircleIcon } from "lucide-svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import { createMutation, createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import * as Select from "$lib/components/ui/select"
  import SuperDebug, { superForm, defaults } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { createFromTemplateCommand } from "@undb/commands"
  import { toast } from "svelte-sonner"
  import { Checkbox } from "$lib/components/ui/checkbox/index.js"
  import * as Form from "$lib/components/ui/form/index.js"
  import { goto, invalidate } from "$app/navigation"
  import LoginOrSignup from "../auth/login-or-signup.svelte"

  export let template: ITemplateDTO
  export let me: any

  let open = false

  const getSpacesQuery = createQuery({
    queryKey: ["space", "list"],
    queryFn: () => trpc.space.list.query({ userId: me.user.userId }),
    enabled: !!me && open,
  })

  $: spaces = $getSpacesQuery.data ?? []
  $: items = spaces.map((space) => ({
    value: space.id,
    label: space.name,
  }))

  const createFromTemplate = createMutation({
    mutationFn: trpc.template.createFromTemplate.mutate,
    async onSuccess(data, variables, context) {
      toast.success("Base created successfully")
      if ($formData.spaceId === me?.member?.spaceId) {
        if (data.baseIds.length > 0) {
          await goto(`/bases/${data.baseIds[0]}`)
        }
      } else {
        await goto(`/api/spaces/${$formData.spaceId}/goto`)
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const form = superForm(
    defaults(
      {
        id: template.id,
        includeData: false,
        spaceId: me?.member?.spaceId,
      },
      zodClient(createFromTemplateCommand),
    ),
    {
      validators: zodClient(createFromTemplateCommand),
      SPA: true,
      dataType: "json",
      onSubmit(event) {
        validateForm({ update: true })
      },
      onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors, event.form.data)
          return
        }

        $createFromTemplate.mutate(event.form.data)
      },
    },
  )

  const { enhance, form: formData, validateForm, tainted } = form
  $: selected = $formData.spaceId ? spaces.find((space) => space.id === $formData.spaceId) : undefined
  $: selectedSpace = selected
    ? {
        label: selected.name,
        value: selected.id,
      }
    : undefined
</script>

<header class="flex items-center justify-between border-b px-4 py-2">
  <div class="flex items-center gap-2">
    <img src={Logo} alt="undb" class="size-4" />
    <span class="text-sm font-medium"> Undb Template </span>
  </div>

  {#if me}
    <Dialog.Root
      bind:open
      onOpenChange={(open) => {
        if (open) {
          $getSpacesQuery.refetch()
        }
      }}
    >
      <Dialog.Trigger asChild let:builder>
        <Button size="sm" builders={[builder]}>Get started with this template</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Which space do you want to create this template in?</Dialog.Title>
          <Dialog.Description>You can create a new base or a new table in the selected space.</Dialog.Description>
        </Dialog.Header>

        <form method="POST" use:enhance>
          <Form.Field {form} name="spaceId">
            <Form.Control let:attrs>
              <Form.Label>Space</Form.Label>

              <Select.Root
                selected={selectedSpace}
                onSelectedChange={(v) => {
                  v && ($formData.spaceId = v.value)
                }}
              >
                <Select.Trigger class="w-full">
                  <Select.Value placeholder="Space" />
                </Select.Trigger>
                <Select.Content sameWidth>
                  {#each items as item}
                    <Select.Item value={item.value}>{item.label}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
              <input hidden bind:value={$formData.spaceId} name={attrs.name} />
            </Form.Control>
            <Form.Description
              >Select a space to create a new base or a new table in the selected space.</Form.Description
            >
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
                <Form.Description>Include data from the template to the new base or table.</Form.Description>
              </div>
              <input name={attrs.name} value={$formData.includeData} hidden />
            </Form.Control>
          </Form.Field>

          <Form.Button disabled={$createFromTemplate.isPending} class="mt-2 w-full">
            {#if $createFromTemplate.isPending}
              <LoaderCircleIcon class="mr-2 size-4 animate-spin" />
            {/if}
            Import
          </Form.Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  {:else}
    <Button href={`/login?redirect=${encodeURIComponent(`/templates/${template.id}`)}`}
      >Login to create a new base or table</Button
    >
  {/if}
</header>
