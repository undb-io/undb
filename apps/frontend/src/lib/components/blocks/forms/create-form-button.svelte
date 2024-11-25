<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import { PlusCircleIcon } from "lucide-svelte"
  import { cn } from "$lib/utils"
  import { hasPermission } from "$lib/store/space-member.store"
  import CreateForm from "./create-form.svelte"
  import { LL } from "@undb/i18n/client"

  let open = false
</script>

{#if $hasPermission("table:update")}
  <Popover.Root bind:open>
    <Popover.Trigger asChild let:builder>
      <Button class={cn("mt-4", $$restProps.class)} builders={[builder]} {...$$restProps}>
        <slot>
          <PlusCircleIcon class="mr-2 h-4 w-4" />
          {$LL.table.form.create()}
        </slot>
      </Button>
    </Popover.Trigger>
    <Popover.Content>
      <CreateForm onSuccess={() => (open = false)} />
    </Popover.Content>
  </Popover.Root>
{/if}
