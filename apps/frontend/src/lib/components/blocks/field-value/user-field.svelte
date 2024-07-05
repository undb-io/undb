<script lang="ts">
  import { cn } from "$lib/utils"
  import * as HoverCard from "$lib/components/ui/hover-card"
  import UserCard from "../user/user-card.svelte"

  export let value: string | undefined = undefined
  export let displayValue: string | undefined = undefined

  export let disableHoverCard = false
</script>

<div class={$$restProps.class}>
  <HoverCard.Root>
    <HoverCard.Trigger>
      <span
        data-field-value={value}
        class={cn(
          "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
        )}
      >
        {displayValue}
      </span>
    </HoverCard.Trigger>

    {#if value && !disableHoverCard}
      <UserCard userId={value} />
    {/if}
  </HoverCard.Root>
</div>
