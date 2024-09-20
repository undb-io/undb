<script lang="ts">
  import GalleryViewCard from "./gallery-view-card.svelte"
  import { getRecordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import type { Readable } from "svelte/store"
  import GalleryViewEmpty from "./gallery-view-empty.svelte"

  const table = getTable()
  export let viewId: Readable<string>
  export let fieldId: string
  const recordsStore = getRecordsStore()

  $: fields = $table.getOrderedVisibleFields($viewId) ?? []

  let records = recordsStore.records
</script>

{#if $records.length === 0}
  <GalleryViewEmpty />
{:else}
  <div class="grid w-full flex-1 gap-4 overflow-y-auto md:grid-cols-5">
    {#each $records as record (record.id.value)}
      <GalleryViewCard {record} {fieldId} {fields} />
    {/each}
  </div>
{/if}
