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
</script>

<div class="flex items-center gap-2 border-b p-2">
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
