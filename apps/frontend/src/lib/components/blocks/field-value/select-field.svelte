<script lang="ts">
  import Option from "$lib/components/blocks/option/option.svelte"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import type { IOptionId, SelectField } from "@undb/table"

  export let value: IOptionId | IOptionId[] | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let field: SelectField
</script>

{#if Array.isArray(value)}
  {#if value.length > 0}
    <div class="flex flex-nowrap items-center gap-1 overflow-hidden">
      {#each value as optionId}
        {@const option = field.options.find((o) => o.id === optionId)}
        {#if option}
          <Option {option} />
        {/if}
      {/each}
    </div>
  {:else}
    {placeholder}
  {/if}
{:else if value}
  {@const option = field.options.find((o) => o.id === value)}
  {#if option}
    <Option {option} />
  {:else}
    {placeholder}
  {/if}
{/if}
