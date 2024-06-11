<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import IdField from "./id-field.svelte"

  export let value: string[]
</script>

<div class="flex gap-1 overflow-hidden px-2">
  {#if Array.isArray(value)}
    {#each value as id}
      <div class="flex items-center gap-2">
        <IdField value={id} />
      </div>
    {/each}
  {/if}
</div>
