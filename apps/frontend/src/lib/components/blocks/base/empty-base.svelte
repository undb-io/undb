<script lang="ts">
  import { InboxIcon } from "lucide-svelte"
  import CreateBaseButton from "./create-base-button.svelte"
</script>

<main class="flex h-full flex-col overflow-hidden">
  <div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <InboxIcon class="text-muted-foreground h-16 w-16" />
      <h3 class="text-sm font-bold tracking-tight">There is no base in the space.</h3>
      <p class="text-muted-foreground text-sm">You can start create table as soon as you add a base.</p>
      <CreateBaseButton />
    </div>
  </div>
</main>
