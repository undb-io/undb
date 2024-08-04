<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import type { ISpaceDTO } from "@undb/space"
  import { builderActions, getAttrs } from "bits-ui"
  import Logo from "$lib/images/logo.svg"
  import { PlusSquareIcon } from "lucide-svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import { GetSpacesStore } from "$houdini"
  import Role from "../member/role.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { createSpaceCommand } from "@undb/commands"
  import { goto, invalidateAll } from "$app/navigation"

  export let space: ISpaceDTO
  export let me: any

  let open = false
  let createOpen = false

  const store = new GetSpacesStore()
  $: open && store.fetch()

  $: spaces = $store.data?.spaces ?? []

  const createSpaceMutation = createMutation({
    mutationFn: trpc.space.create.mutate,
    async onSuccess(data, variables, context) {
      await fetch(`/api/spaces/${data}/goto`)
      await goto("/")
      await invalidateAll()
    },
  })

  const form = superForm(
    defaults(
      {
        name: `${me.username}'s Space`,
      },
      zodClient(createSpaceCommand),
    ),
    {
      resetForm: false,
      SPA: true,
      dataType: "json",
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) {
          return
        }

        $createSpaceMutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance } = form
</script>

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger asChild let:builder>
    <button class={$$restProps.class} use:builderActions={{ builders: [builder] }} {...getAttrs([builder])}>
      <img src={Logo} alt="" class="h-4 w-4 rounded-full" />
      {#if space.isPersonal}
        {me.username}'s Personal Space
      {:else}
        {space.name}
      {/if}
    </button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content sameWidth>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Spaces</DropdownMenu.Label>
      <DropdownMenu.Separator />
      {#each spaces as space}
        {#if space}
          <DropdownMenu.Item
            on:click={async () => {
              await fetch(`/api/spaces/${space.id}/goto`)
              await goto("/")
              await invalidateAll()
            }}
            class="flex items-center justify-between gap-2 text-xs"
          >
            <div class="flex items-center gap-2">
              <img src={Logo} alt="" class="h-4 w-4 rounded-full" />
              {#if space.isPersonal}
                {me.username}'s Personal Space
              {:else}
                {space.name}
              {/if}
            </div>

            {#if space.member}
              <Role role={space.member.role} />
            {/if}
          </DropdownMenu.Item>
        {/if}
      {/each}
      <DropdownMenu.Separator />
      <DropdownMenu.Item on:click={() => (createOpen = true)} class="flex items-center justify-center text-xs">
        <PlusSquareIcon class="mr-2 h-4 w-4" />
        Create New Space
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={createOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Space</Dialog.Title>
      <Dialog.Description>Create new space to organize your data and collaborate with your team.</Dialog.Description>
    </Dialog.Header>

    <form use:enhance>
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description>This is your space name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Button class="flex w-full items-center gap-2">
        <PlusSquareIcon class="mr-2 h-4 w-4" />
        Create New Space
      </Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
