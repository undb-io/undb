<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { BetweenHorizonalEnd } from "lucide-svelte"
  import { createRecordSheetOpen } from "./create-record.store"
</script>

<Button size="sm" variant="outline" on:click={() => ($createRecordSheetOpen = true)}>
  <BetweenHorizonalEnd class="mr-1 h-4 w-4" />
  Create Record
</Button>
