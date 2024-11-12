<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { Readable, Writable } from "svelte/store"
  import PivotViewOption from "./pivot-view-option.svelte"
  import PivotViewData from "./pivot-view-data.svelte"
  import PivotViewToolbar from "./pivot-view-toolbar.svelte"

  const table = getTable()
  export let viewId: Readable<string>
  export let r: Writable<string | null>

  $: view = $table.views.getViewById($viewId)
</script>

{#key $table.id.value}
  {#if view.type === "pivot"}
    <PivotViewToolbar {viewId} {view} />
    {#if !view.isValid}
      <section class="bg-muted flex h-full w-full items-center justify-center">
        <PivotViewOption {view} />
      </section>
    {:else}
      <PivotViewData {view} />
    {/if}
  {/if}
{/key}
