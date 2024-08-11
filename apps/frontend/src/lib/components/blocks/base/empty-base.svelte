<script lang="ts">
  import { SquareMousePointer } from "lucide-svelte"
  import CreateBaseButton from "./create-base-button.svelte"
</script>

<main class="flex h-full flex-col overflow-hidden">
  <div class="flex flex-1 -translate-y-20 items-center justify-center rounded-lg border border-dashed shadow-sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <SquareMousePointer class="text-primary h-10 w-10" />
      <h3 class="text-sm font-bold tracking-tight">You have no bases</h3>
      <p class="text-muted-foreground text-sm">You can start create table as soon as you add a base.</p>
      <CreateBaseButton />
    </div>
  </div>
</main>
