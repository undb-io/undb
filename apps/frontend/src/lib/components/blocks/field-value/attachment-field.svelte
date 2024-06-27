<script lang="ts">
  import type { IAttachmentFieldValue } from "@undb/table"

  export let value: IAttachmentFieldValue | undefined = undefined
</script>

<span data-field-value={value}>
  {#if value}
    {#each value as v}
      {v.name}
    {/each}
  {/if}
</span>
