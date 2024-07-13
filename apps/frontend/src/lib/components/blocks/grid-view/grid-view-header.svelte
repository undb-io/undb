<script lang="ts">
  import type { Field } from "@undb/table"
  import { Button } from "$lib/components/ui/button"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { ChevronDownIcon, PencilIcon, SettingsIcon } from "lucide-svelte"
  import * as Popover from "$lib/components/ui/popover"
  import UpdateField from "../update-field/update-field.svelte"
  import { cn } from "$lib/utils"

  export let field: Field

  let update = false
  let open = false
</script>

<div data-field-id={field.id.value} data-field-type={field.type} class="flex items-center justify-between gap-1">
  <div class="flex items-center gap-1">
    <FieldIcon {field} type={field.type} class="h-4 w-4" />
    <span>
      {field.name.value}
    </span>
  </div>

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
    <Popover.Content class={cn("p-0 transition-all", update ? "w-[400px]" : "w-[250px]")}>
      {#if update}
        <UpdateField
          class="px-4 py-6"
          {field}
          onSuccess={() => {
            open = false
            update = false
          }}
        />
      {:else}
        <Button
          class="w-full justify-start rounded-none border-none text-xs"
          variant="outline"
          on:click={() => (update = true)}
        >
          <PencilIcon class="mr-2 h-3 w-3" />
          Update Field
        </Button>
      {/if}
    </Popover.Content>
  </Popover.Root>
</div>
