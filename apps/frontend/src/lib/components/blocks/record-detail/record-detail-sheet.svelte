<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import Button from "$lib/components/ui/button/button.svelte"
  import RecordDetail from "./record-detail.svelte"
  import { queryParam, ssp } from "sveltekit-search-params"

  const r = queryParam("r", ssp.string(), { pushHistory: false })

  let disabled = false
  let dirty = false
</script>

<Sheet.Root
  open={!!$r}
  onOpenChange={(open) => {
    if (!open) {
      r.set("")
    }
    // if (!open && dirty) {
    //   if (confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
    //     $r = null
    //   }
    // }
  }}
>
  <Sheet.Content class="sm:max-w-1/2 flex w-1/2 flex-col" transitionConfig={{ duration: 50 }}>
    <Sheet.Header>
      <Sheet.Title>Record Detail</Sheet.Title>
    </Sheet.Header>

    <div class="flex-1">
      <RecordDetail />
    </div>

    <Sheet.Footer>
      <Button variant="outline" type="button" on:click={() => ($r = "")}>Cancel</Button>
      <Button type="submit" form="createRecord" {disabled}>Create</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
