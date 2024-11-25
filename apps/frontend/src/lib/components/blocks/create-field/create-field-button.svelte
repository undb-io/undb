<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { BetweenVerticalStartIcon } from "lucide-svelte"
  import * as Popover from "$lib/components/ui/popover"
  import CreateField from "./create-field.svelte"
  import { LL } from "@undb/i18n/client"
  import { hasPermission } from "$lib/store/space-member.store"

  let open = false
</script>

{#if $hasPermission("field:create")}
  <Popover.Root bind:open portal="body">
    <Popover.Trigger asChild let:builder>
      <Button builders={[builder]} size="sm" variant="outline" {...$$restProps}>
        <slot>
          <BetweenVerticalStartIcon class="mr-1 h-4 w-4" />
          {$LL.table.field.create()}
        </slot>
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-[400px] shadow-2xl">
      <CreateField
        onSuccess={() => {
          open = false
        }}
      />
    </Popover.Content>
  </Popover.Root>
{/if}
