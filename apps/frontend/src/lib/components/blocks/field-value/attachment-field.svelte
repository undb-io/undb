<script lang="ts">
  import type { IAttachmentFieldValue } from "@undb/table"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { FileIcon } from "lucide-svelte"

  export let value: IAttachmentFieldValue | undefined = undefined
</script>

<span data-field-value={value}>
  {#if value}
    {#each value as v}
      <Tooltip.Root>
        <Tooltip.Trigger>
          <FileIcon />
        </Tooltip.Trigger>
        <Tooltip.Content transitionConfig={{ duration: 100 }}>
          <p>
            {v.name}
          </p>
        </Tooltip.Content>
      </Tooltip.Root>
    {/each}
  {/if}
</span>
