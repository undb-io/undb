<script lang="ts">
  import type { GetBaseQuery$result } from "$houdini"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js"
  import { DUPLICATE_BASE_MODAL, UPDATE_BASE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { HardDriveIcon, PencilIcon, ChevronDownIcon, CopyIcon } from "lucide-svelte"
  import DuplicateBase from "./duplicate-base.svelte"
  import { SettingsIcon } from "lucide-svelte"

  export let base: GetBaseQuery$result["base"]
</script>

<header class="flex h-12 items-center border-b px-4 py-3">
  {#if base}
    <DropdownMenu.Root>
      <div class="flex items-center gap-2">
        <DropdownMenu.Trigger>
          <div class="flex items-center gap-2">
            <HardDriveIcon class="h-4 w-4" />
            {base.name}

            <ChevronDownIcon class="h-4 w-4" />
          </div>
        </DropdownMenu.Trigger>
        <a href={`/bases/${base.id}/setting`}>
          <SettingsIcon class="h-4 w-4" />
        </a>
      </div>
      <DropdownMenu.Content class="w-[200px]">
        <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(UPDATE_BASE_MODAL)}>
          <PencilIcon class="mr-2 h-3 w-3" />
          Update Base Name
        </DropdownMenu.Item>
        <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(DUPLICATE_BASE_MODAL)}>
          <CopyIcon class="mr-2 h-3 w-3" />
          Duplicate Base
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  {/if}
</header>

<DuplicateBase {base} />
