<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CirclePlusIcon, SearchIcon, SettingsIcon, PanelLeftCloseIcon, PackageIcon } from "lucide-svelte"
  import { commandOpen } from "../command/command.store"
  import { CREATE_BASE_MODAL, IMPORT_TEMPLATE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { page } from "$app/stores"
  import { hasPermission } from "$lib/store/space-member.store"
  import SpaceDropdown from "../space/space-dropdown.svelte"
  import type { ISpaceDTO } from "@undb/space"
  import { preferences } from "$lib/store/persisted.store"
  import { LL } from "@undb/i18n/client"

  export let space: ISpaceDTO | undefined | null
  export let me: any
</script>

<div class="w-full space-y-2">
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
    <span class="inline-flex items-center text-muted-foreground">
      <SearchIcon class="text-muted-foreground mr-2 h-3 w-3" />
      {$LL.common.search()}
    </span>
    <span>
      <code class="bg-muted relative rounded border border-gray-300 px-[0.3rem] py-[0.2rem] font-mono text-xs">
        ⌘ + K
      </code>
    </span>
  </Button>

  <div class="flex flex-col gap-1">
    <Button
      href={`/settings?tab=members`}
      data-active={$page.route.id === "/(authed)/(space)/settings"}
      class="data-[active=true]:bg-primary/80 data-[active=true]:text-primary-foreground w-full justify-start py-1 text-left"
      variant="link"
      size="xs"
    >
      <SettingsIcon class="mr-2 size-4" />
      {#if space?.isPersonal}
        {$LL.setting.setting()}
      {:else}
        {$LL.setting.settingAndMembers()}
      {/if}
    </Button>

    {#if $hasPermission("base:create")}
      <Button
        class="w-full justify-start text-left"
        on:click={() => toggleModal(CREATE_BASE_MODAL)}
        variant="link"
        size="xs"
      >
        <CirclePlusIcon class="mr-2 size-4" />
        {$LL.base.createBase()}
      </Button>

      <Button
        class="w-full justify-start text-left"
        on:click={() => toggleModal(IMPORT_TEMPLATE_MODAL)}
        variant="link"
        size="xs"
      >
        <PackageIcon class="mr-2 size-4" />
        {$LL.base.importFromTemplate()}
      </Button>
    {/if}
  </div>
</div>
