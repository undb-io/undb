<script lang="ts">
  import type { Readable } from "svelte/store"
  import CalendarView from "../calendar-view/calendar-view.svelte"
  import { r } from "$lib/store/records.store"

  export let viewId: Readable<string>
  export let shareId: string
</script>

<CalendarView readonly {shareId} {viewId} {r} />

{#await import("$lib/components/blocks/view-widget/view-widget-sheet.svelte") then { default: ViewWidgetSheet }}
  <ViewWidgetSheet {viewId} {shareId} readonly />
{/await}
