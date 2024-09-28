<script lang="ts">
  import type { IOption } from "@undb/table"
  import Option from "../option/option.svelte"
  import { ChevronRightIcon } from "lucide-svelte"
  import { kanbanStore } from "$lib/store/kanban.store"

  export let option: IOption
  export let viewId: string | undefined
</script>

<div class="flex h-full w-full flex-1 flex-col items-center gap-2">
  <button on:click={() => kanbanStore.toggleLane(viewId ?? "", option.id)}>
    <ChevronRightIcon class="text-muted-foreground h-4 w-4" />
  </button>
  <Option class="translate-y-8 -rotate-90 text-nowrap" {option} />
</div>
