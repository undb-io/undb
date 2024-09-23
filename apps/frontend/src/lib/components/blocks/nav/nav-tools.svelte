<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { PlusIcon, SearchIcon, SettingsIcon, PanelLeftCloseIcon } from "lucide-svelte"
  import { commandOpen } from "../command/command.store"
  import { CREATE_BASE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { page } from "$app/stores"
  import { hasPermission } from "$lib/store/space-member.store"
  import SpaceDropdown from "../space/space-dropdown.svelte"
  import type { ISpaceDTO } from "@undb/space"
  import { preferences } from "$lib/store/persisted.store"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { toast } from "svelte-sonner"
  import { goto, invalidateAll } from "$app/navigation"

  export let space: ISpaceDTO | undefined | null
  export let me: any

  const createFromTemplateMutation = createMutation({
    mutationFn: trpc.template.createFromTemplate.mutate,
    onSuccess: async (data) => {
      await invalidateAll()
      toast.success("Base created successfully")
      if (data.baseIds.length > 0) {
        goto(`/bases/${data.baseIds[0]}`)
      }
    },
  })
</script>

<div class="w-full space-y-1">
  <div class="flex items-center justify-between">
    {#if space}
      <SpaceDropdown
        {me}
        {space}
        class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring data-[active=true]:bg-primary data-[active=true]:text-primary-foreground flex h-8 w-full flex-1 items-center justify-start gap-2 whitespace-nowrap rounded-md px-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
      />
    {/if}
    <button on:click={() => preferences.update((p) => ({ ...p, panelLeftCollapsed: true, panelLeftWidth: 0 }))}>
      <PanelLeftCloseIcon class="text-muted-foreground size-4" />
    </button>
  </div>

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

  <a
    href={`/settings?tab=members`}
    data-active={$page.route.id === "/(authed)/(space)/settings"}
    class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring data-[active=true]:bg-primary data-[active=true]:text-primary-foreground flex h-8 items-center justify-start gap-2 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
  >
    <SettingsIcon class="h-4 w-4" />
    {#if space?.isPersonal}
      Settings
    {:else}
      Settings & Members
    {/if}
  </a>

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

    <Button
      class="w-full justify-start text-left"
      on:click={() => $createFromTemplateMutation.mutate({ templateName: "test" })}
      variant="link"
      size="sm"
    >
      <PlusIcon class="mr-2 h-3 w-3" />
      Create New Base
    </Button>
  {/if}
</div>
