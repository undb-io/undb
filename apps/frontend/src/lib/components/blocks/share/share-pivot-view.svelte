<script lang="ts">
  import type { Readable } from "svelte/store"
  import { r } from "$lib/store/records.store"
  import PivotView from "../pivot-view/pivot-view.svelte"

  export let viewId: Readable<string>
  export let shareId: string
</script>

<PivotView readonly {shareId} {viewId} {r} />

{#await import("$lib/components/blocks/view-widget/view-widget-sheet.svelte") then { default: ViewWidgetSheet }}
  <ViewWidgetSheet {viewId} {shareId} readonly />
{/await}
