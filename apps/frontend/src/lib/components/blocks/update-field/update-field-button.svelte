<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { SettingsIcon } from "lucide-svelte"
  import * as Popover from "$lib/components/ui/popover"
  import UpdateField from "./update-field.svelte"
  import type { Field } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let field: Field
  let open = false
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} size="sm" variant="outline" {...$$restProps}>
      <slot>
        <SettingsIcon class="mr-2 h-3 w-3" />
        {$LL.table.field.update()}
      </slot>
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[400px] shadow-2xl">
    <UpdateField {field} onSuccess={() => (open = false)} />
  </Popover.Content>
</Popover.Root>
