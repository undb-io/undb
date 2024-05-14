<script lang="ts">
  import { PlusCircleIcon } from "lucide-svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { createTableOpened } from "./create-table.store"
</script>

<Button size="sm" class="w-full" on:click={() => createTableOpened.set(true)} {...$$restProps}>
  <PlusCircleIcon class="mr-2 h-4 w-4" />
  Create table
</Button>
