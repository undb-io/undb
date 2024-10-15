<script lang="ts">
  import * as Popover from "$lib/components/ui/popover"
  import { PlusCircleIcon } from "lucide-svelte"
  import AddDashboardWidget from "./add-dashboard-widget.svelte"
  import { Button } from "$lib/components/ui/button"
</script>

<Popover.Root>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} {...$$restProps}>
      <PlusCircleIcon class="mr-2 h-4 w-4" />
      Add Widget
    </Button>
  </Popover.Trigger>

  <Popover.Content class="w-96">
    <AddDashboardWidget />
  </Popover.Content>
</Popover.Root>
