<script lang="ts">
  import type { Field } from "@undb/table"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { ChevronDownIcon, FilterIcon, PaintBucketIcon, SettingsIcon } from "lucide-svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { UPDATE_FIELD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { fieldId } from "$lib/store/field.store"
  import { tick } from "svelte"

  export let field: Field
</script>

<div data-field-id={field.id.value} data-field-type={field.type} class="flex items-center justify-between gap-1">
  <div class="flex items-center gap-1">
    <FieldIcon {field} type={field.type} class="h-4 w-4" />
    <span>
      {field.name.value}
    </span>
  </div>

  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-[250px]">
      <DropdownMenu.Item
        class="text-xs"
        on:click={async () => {
          $fieldId = field.id.value
          await tick()
          toggleModal(UPDATE_FIELD_MODAL)
        }}
      >
        <SettingsIcon class="text-muted-foreground mr-2 h-4 w-4" />
        Update Field
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
