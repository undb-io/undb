<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { Readable, Writable } from "svelte/store"
  import PivotViewOption from "./pivot-view-option.svelte"
  import PivotViewData from "./pivot-view-data.svelte"
  import PivotViewToolbar from "./pivot-view-toolbar.svelte"

  const table = getTable()
  export let viewId: Readable<string | undefined>
  export let r: Writable<string | null>
  export let readonly: boolean = false
  export let shareId: string | undefined

  $: view = $table.views.getViewById($viewId)
</script>

{#key $table.id.value}
  {#if view.type === "pivot"}
    <PivotViewToolbar {viewId} {view} {readonly} {shareId} />
    {#if !view.isValid && !readonly && !shareId}
      <section class="bg-muted flex h-full w-full items-center justify-center">
        <PivotViewOption {view} />
      </section>
    {:else}
      <PivotViewData {view} {readonly} {shareId} />
    {/if}
  {/if}
{/key}
