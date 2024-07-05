<script lang="ts">
  import { type SelectField } from "@undb/table"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"

  import Option from "./option.svelte"
  import { cn } from "$lib/utils"

  export let field: SelectField
  export let value: string | string[] | null = null

  export let onValueChange = (value: string | null) => {}

  $: selected = field.options.find((option) => option.id === value)

  export let open = false
</script>

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger class={cn($$restProps.class, "w-full")}>
    {#if selected}
      <Option option={selected} />
    {/if}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      {#each field.options as option}
        <DropdownMenu.Item on:click={() => onValueChange(option.id === value ? null : option.id)}>
          <Option {option} />
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
