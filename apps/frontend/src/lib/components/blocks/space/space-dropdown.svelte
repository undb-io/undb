<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import type { ISpaceDTO } from "@undb/space"
  import { builderActions, getAttrs } from "bits-ui"
  import Logo from "$lib/images/logo.svg"
  import { PlusSquareIcon } from "lucide-svelte"
  import { GetSpacesStore } from "$houdini"
  import Role from "../member/role.svelte"

  export let space: ISpaceDTO
  export let me: any

  let open = false

  const store = new GetSpacesStore()
  $: open && store.fetch()

  $: spaces = $store.data?.spaces ?? []
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
          <DropdownMenu.Item class="flex items-center justify-between gap-2 text-xs">
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
      <DropdownMenu.Item class="flex items-center justify-center text-xs">
        <PlusSquareIcon class="mr-2 h-4 w-4" />
        Create New Workspace
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
