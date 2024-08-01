<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { BetweenVerticalStartIcon } from "lucide-svelte"
  import * as Popover from "$lib/components/ui/popover"
  import CreateField from "./create-field.svelte"

  let open = false
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} size="sm" variant="outline" {...$$restProps}>
      <slot>
        <BetweenVerticalStartIcon class="mr-1 h-4 w-4" />
        Create Field
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
