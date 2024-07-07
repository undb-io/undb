<script lang="ts">
  import { cn } from "$lib/utils"
  import * as HoverCard from "$lib/components/ui/hover-card"
  import UserCard from "../user/user-card.svelte"
  import type { ISingleUserFieldValue, IUserFieldDisplayValue } from "@undb/table"

  export let value: ISingleUserFieldValue = null
  export let displayValue: IUserFieldDisplayValue = null

  export let disableHoverCard = false
</script>

<div class={$$restProps.class}>
  <HoverCard.Root>
    <HoverCard.Trigger>
      {#if displayValue}
        <span
          data-field-value={value}
          class={cn(
            "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
          )}
        >
          {displayValue?.username}
        </span>
      {/if}
    </HoverCard.Trigger>

    {#if value && !disableHoverCard}
      <UserCard userId={value} />
    {/if}
  </HoverCard.Root>
</div>
