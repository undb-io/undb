<script lang="ts">
  import type { Readable } from "svelte/store"
  import GalleryView from "../gallery-view/gallery-view.svelte"
  import { r } from "$lib/store/records.store"

  export let viewId: Readable<string>
  export let shareId: string
</script>

<GalleryView {shareId} {viewId} {r} />
