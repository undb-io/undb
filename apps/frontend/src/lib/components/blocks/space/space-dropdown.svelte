<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import type { ISpaceDTO } from "@undb/space"
  import { builderActions, getAttrs } from "bits-ui"
  import Logo from "$lib/images/logo.svg"
  import { LoaderCircleIcon, PlusSquareIcon } from "lucide-svelte"
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
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { toast } from "svelte-sonner"
  import { LL } from "@undb/i18n/client"

  export let space: ISpaceDTO
  export let me: any

  let open = false
  let createOpen = false

  const store = new GetSpacesStore()
  $: open && store.fetch({ policy: "NetworkOnly" })

  $: spaces = $store.data?.spaces ?? []

  const createSpaceMutation = createMutation({
    mutationKey: ["space", "create"],
    mutationFn: trpc.space.create.mutate,
    onError(error, variables, context) {
      toast.error(error.message)
    },
    async onSuccess(data, variables, context) {
      await fetch(`/api/spaces/${data}/goto`)
      await goto("/")
      createOpen = false
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
      validators: zodClient(createSpaceCommand),
      onSubmit(input) {
        validateForm()
      },
      onUpdate(event) {
        if (!event.form.valid) {
          return
        }

        $createSpaceMutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance, validateForm, tainted } = form
</script>

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger asChild let:builder>
    <button class={$$restProps.class} use:builderActions={{ builders: [builder] }} {...getAttrs([builder])}>
      <img src={Logo} alt="" class="h-4 w-4 rounded-full" />
      {#if space.isPersonal && !space.name}
        {$LL.space.personalSpace({ username: me.username })}
      {:else}
        {space.name}
      {/if}
    </button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content sameWidth>
    <DropdownMenu.Group>
      <DropdownMenu.Label>{$LL.space.spaces()}</DropdownMenu.Label>
      <DropdownMenu.Separator />
      {#if $store.fetching}
        <div class="space-y-2 px-2 py-2">
          <Skeleton class="h-10 w-full rounded-sm" />
          <Skeleton class="h-10 w-full rounded-sm" />
          <Skeleton class="h-10 w-full rounded-sm" />
        </div>
      {:else}
        <div class="max-h-96 overflow-y-auto">
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
                  {#if space.isPersonal && !space.name}
                    {$LL.space.personalSpace({ username: me.username })}
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
        </div>
      {/if}
      <DropdownMenu.Separator />
      <DropdownMenu.Item on:click={() => (createOpen = true)} class="flex items-center justify-center text-xs">
        <PlusSquareIcon class="mr-2 h-4 w-4" />
        {$LL.space.createSpace()}
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={createOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$LL.space.createSpace()}</Dialog.Title>
      <Dialog.Description>{$LL.space.createSpaceDescription()}</Dialog.Description>
    </Dialog.Header>

    <form use:enhance>
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>{$LL.space.spaceName()}</Form.Label>
          <Input {...attrs} disabled={$createSpaceMutation.isPending} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description>{$LL.space.spaceNameDescription()}</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Button disabled={$createSpaceMutation.isPending} class="flex w-full items-center gap-2">
        {#if $createSpaceMutation.isPending}
          <LoaderCircleIcon class="mr-2 h-4 w-4" />
        {:else}
          <PlusSquareIcon class="mr-2 h-4 w-4" />
        {/if}
        {$LL.space.createSpace()}
      </Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
