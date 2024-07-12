<script lang="ts">
  import type { Field } from "@undb/table"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { ChevronDownIcon, SettingsIcon } from "lucide-svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import UpdateFieldButton from "../update-field/update-field-button.svelte"

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
    <DropdownMenu.Content class="w-[250px] p-0">
      <DropdownMenu.Item asChild>
        <UpdateFieldButton {field} class="w-full justify-start rounded-none border-none text-xs" />
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
