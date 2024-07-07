<script lang="ts">
  import { cn } from "$lib/utils"
  import * as HoverCard from "$lib/components/ui/hover-card"
  import UserCard from "../user/user-card.svelte"
  import type { ISingleUserFieldValue, IUserFieldDisplayValue } from "@undb/table"
  import * as Avatar from "$lib/components/ui/avatar"

  export let value: ISingleUserFieldValue = null
  export let displayValue: IUserFieldDisplayValue = null

  export let disableHoverCard = false
  let open = false
</script>

<div class={$$restProps.class}>
  <HoverCard.Root bind:open>
    <HoverCard.Trigger>
      {#if displayValue}
        <span
          data-field-value={value}
          class={cn(
            "relative inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
          )}
        >
          <Avatar.Root class="absolute left-0 h-6 w-6 border">
            <Avatar.Image src="" alt={displayValue.username} />
            <Avatar.Fallback>{displayValue.username?.slice(0, 2)}</Avatar.Fallback>
          </Avatar.Root>

          <span class="ml-5">
            {displayValue?.username}
          </span>
        </span>
      {/if}
    </HoverCard.Trigger>

    {#if value && !disableHoverCard}
      <UserCard {open} userId={value} />
    {/if}
  </HoverCard.Root>
</div>
