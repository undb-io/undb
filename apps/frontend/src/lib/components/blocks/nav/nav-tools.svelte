<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { PlusIcon, SearchIcon, Users2Icon } from "lucide-svelte"
  import { commandOpen } from "../command/command.store"
  import { CREATE_BASE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { page } from "$app/stores"
  import { hasPermission } from "$lib/store/workspace-member.store"
  import SpaceDropdown from "../space/space-dropdown.svelte"
  import type { ISpaceDTO } from "@undb/space"

  export let space: ISpaceDTO | undefined | null
  export let me: any
</script>

<div class="w-full space-y-1">
  {#if space}
    <SpaceDropdown
      {me}
      {space}
      class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring data-[active=true]:bg-primary data-[active=true]:text-primary-foreground flex h-8 w-full items-center justify-start gap-2 whitespace-nowrap rounded-md px-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
    />
  {/if}

  <Button
    variant="outline"
    size="sm"
    class="mb-2 flex w-full items-center justify-between"
    on:click={() => ($commandOpen = true)}
  >
    <span class="inline-flex items-center">
      <SearchIcon class="text-muted-foreground mr-2 h-3 w-3" />
      Search
    </span>
    <span>
      <code class="bg-muted relative rounded border border-gray-300 px-[0.3rem] py-[0.2rem] font-mono text-xs">
        ⌘ + K
      </code>
    </span>
  </Button>

  {#if !space?.isPersonal}
    <a
      href={`/members`}
      data-active={$page.route.id === "/(authed)/members"}
      class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring data-[active=true]:bg-primary data-[active=true]:text-primary-foreground flex h-8 items-center justify-start gap-2 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
    >
      <Users2Icon class="h-4 w-4" />
      Members
    </a>
  {/if}

  {#if $hasPermission("base:create")}
    <Button
      class="w-full justify-start text-left"
      on:click={() => toggleModal(CREATE_BASE_MODAL)}
      variant="link"
      size="sm"
    >
      <PlusIcon class="mr-2 h-3 w-3" />
      Create New Base
    </Button>
  {/if}
</div>
