<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { cn } from "$lib/utils"
  import IdField from "../../field-value/id-field.svelte"

  let isEditing = false
  export let value: string | undefined
</script>

{#if isEditing}
  <Input
    autofocus
    bind:value
    on:blur={() => (isEditing = false)}
    on:change={() => (isEditing = false)}
    class={$$restProps.class}
  />
{:else}
  <Button
    variant="outline"
    size="sm"
    on:click={() => {
      isEditing = true
    }}
    class={cn($$restProps.class, "justify-start")}
  >
    {#if value}
      <IdField {value} />
    {/if}
  </Button>
{/if}
