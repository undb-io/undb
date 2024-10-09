<script lang="ts">
  import type { Field } from "@undb/table"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { ChevronDownIcon } from "lucide-svelte"
  import * as Popover from "$lib/components/ui/popover"
  import FieldMenu from "../field/field-menu.svelte"
  import { hasPermission } from "$lib/store/space-member.store"

  export let field: Field

  let update = false
  let open = false
</script>

<div data-field-id={field.id.value} data-field-type={field.type} class="flex items-center justify-between gap-1">
  <div class="flex items-center gap-1 overflow-hidden">
    <FieldIcon {field} type={field.type} class="h-4 w-4" />
    <span class="truncate" title={field.name.value} data-field-name={field.name.value} data-field-id={field.id.value}>
      {field.name.value}
    </span>
  </div>

  {#if $hasPermission("field:update") || $hasPermission("field:delete") || $hasPermission("field:create")}
    <Popover.Root
      bind:open
      onOpenChange={(open) => {
        if (!open) {
          update = false
        }
      }}
    >
      <Popover.Trigger>
        <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
      </Popover.Trigger>

      <FieldMenu bind:update bind:open {field} />
    </Popover.Root>
  {/if}
</div>
