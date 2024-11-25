<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js"
  import { DUPLICATE_BASE_MODAL, UPDATE_BASE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { HardDriveIcon, PencilIcon, ChevronDownIcon, CopyIcon } from "lucide-svelte"
  import DuplicateBase from "./duplicate-base.svelte"
  import { SettingsIcon } from "lucide-svelte"
  import ShareButton from "../share/share-button.svelte"
  import type { IBaseOption } from "@undb/base"
  import { invalidate } from "$app/navigation"
  import { LL } from "@undb/i18n/client"

  export let readonly = false
  export let base: {
    id: string
    name: string
    option: IBaseOption | null
    tables: ({
      id: string
      name: string
    } | null)[]
  }
</script>

<header class="flex h-12 items-center justify-between border-b px-4 py-3">
  {#if base}
    <DropdownMenu.Root>
      <div class="flex items-center gap-2">
        <DropdownMenu.Trigger disabled={readonly}>
          <div class="flex items-center gap-2">
            <HardDriveIcon class="h-4 w-4" />
            {base.name}

            {#if !readonly}
              <ChevronDownIcon class="h-4 w-4" />
            {/if}
          </div>
        </DropdownMenu.Trigger>
        {#if !readonly}
          <a href={`/bases/${base.id}/setting`}>
            <SettingsIcon class="h-4 w-4" />
          </a>
        {/if}
      </div>
      <DropdownMenu.Content class="w-[200px]">
        <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(UPDATE_BASE_MODAL)}>
          <PencilIcon class="mr-2 h-3 w-3" />
          {$LL.base.updateBaseName()}
        </DropdownMenu.Item>
        <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(DUPLICATE_BASE_MODAL)}>
          <CopyIcon class="mr-2 h-3 w-3" />
          {$LL.base.duplicateBase({name: base.name})}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>

    {#if !readonly}
      <ShareButton
        type="base"
        id={base.id}
        onSuccess={() => {
          invalidate(`undb:base:${base.id}`)
        }}
      />
    {/if}
  {/if}
</header>

{#if !readonly}
  <DuplicateBase {base} />
{/if}
