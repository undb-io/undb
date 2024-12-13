<script lang="ts">
  import {
    IMPORT_TEMPLATE_MODAL,
    IMPORT_TABLE_MODAL,
    openModal,
    CREATE_BASE_MODAL,
    CREATE_TABLE_MODAL,
  } from "$lib/store/modal.store"
  import { Button } from "$lib/components/ui/button"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { LL } from "@undb/i18n/client"
  import { ImportIcon, ChevronDownIcon, CirclePlusIcon } from "lucide-svelte"
  import { type IBaseDTO } from "@undb/base"
  import { page } from "$app/stores"
  import PlaygroundSpaceButton from "./playground-space-button.svelte"
  import Logo from "$lib/images/logo.svg"

  type Props = {
    bases: IBaseDTO[]
    isLoggedIn: boolean
  }

  let { bases, isLoggedIn }: Props = $props()

  let baseId = $derived($page.params.baseId)
  let selectedBase = $derived(bases.find((base) => base.id === baseId))
  let selectedValue = $derived(selectedBase ? { value: selectedBase.id, label: selectedBase.name } : undefined)
</script>

<div class="flex items-center justify-between gap-2 border-b p-2">
  <!-- <Select.Root
    selected={selectedValue}
    onSelectedChange={async (v) => {
      if (v) {
       await goto(`/playground/bases/${v.value}`)
      }
    }}
  >
    <Select.Trigger class="h-6 w-[250px] rounded-sm px-2 text-xs">
      <HardDriveIcon class="mr-2 size-4 shrink-0" />
      <Select.Value placeholder="Base" />
    </Select.Trigger>
    <Select.Content>
      {#each bases as base}
        <Select.Item class="flex items-center overflow-hidden" value={base.id}>
          <HardDriveIcon class="mr-2 size-4 shrink-0" />
          <span class="flex-1 truncate">{base.name}</span>
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root> -->

  <div class="flex items-center gap-2">
    <img src={Logo} alt="" class="h-4 w-4 rounded-full" />
       <div class="flex items-center gap-0">
      <Button
        size="xs"
        variant="outline"
        class="rounded-r-none"
        on:click={() => {
          openModal(IMPORT_TEMPLATE_MODAL)
        }}
      >
        <ImportIcon class="mr-2 h-3 w-3" />
        {$LL.base.importFromTemplate()}
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button builders={[builder]} size="xs" variant="outline" class="rounded-l-none border-l-0">
            <ChevronDownIcon class="h-3 w-3" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-40">
          <DropdownMenu.Group>
            <DropdownMenu.Item
              class="text-xs"
              on:click={() => {
                openModal(CREATE_BASE_MODAL)
              }}
            >
              <CirclePlusIcon class="mr-2 h-3 w-3" />
              {$LL.base.createBase()}
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>

    <div class="flex items-center gap-0">
      <Button
        size="xs"
        variant="outline"
        class="rounded-r-none"
        on:click={() => {
          openModal(IMPORT_TABLE_MODAL)
        }}
      >
        <ImportIcon class="mr-2 h-3 w-3" />
        {$LL.table.common.import()}
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button builders={[builder]} size="xs" variant="outline" class="rounded-l-none border-l-0">
            <ChevronDownIcon class="h-3 w-3" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-40">
          <DropdownMenu.Group>
            <DropdownMenu.Item
              class="text-xs"
              on:click={() => {
                openModal(CREATE_TABLE_MODAL)
              }}
            >
              <CirclePlusIcon class="mr-2 h-3 w-3" />
              {$LL.table.common.create()}
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>

  <div class="flex items-center gap-2">
    <PlaygroundSpaceButton size="xs" {isLoggedIn} />
  </div>
</div>
