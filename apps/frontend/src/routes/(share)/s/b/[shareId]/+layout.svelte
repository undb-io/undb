<script lang="ts">
  import BaseHeader from "$lib/components/blocks/base/base-header.svelte"
  import ShareBaseNav from "$lib/components/blocks/base/share-base-nav.svelte"
  import * as Resizable from "$lib/components/ui/resizable"
  import type { PaneAPI } from "paneforge"
  import type { LayoutData } from "./$types"
  import { ScrollArea } from "$lib/components/ui/scroll-area"

  export let data: LayoutData

  $: getShareBaseStore = data.getShareBaseStore
  $: base = $getShareBaseStore.data?.baseByShare

  let panelLeft: PaneAPI
  let collapsed = false
</script>

<main class="flex flex-col">
  {#if base}
    <Resizable.PaneGroup direction="horizontal">
      <Resizable.Pane
        bind:pane={panelLeft}
        onCollapse={() => (collapsed = true)}
        onExpand={() => (collapsed = false)}
        class="bg-muted/40 hidden border-r md:block"
        defaultSize={20}
        minSize={15}
        maxSize={30}
      >
        <div class="flex h-full max-h-screen flex-col gap-2">
          <div class="border-b px-4 py-2">
            <!-- <NavTools {space} {me} /> -->
          </div>
          <ScrollArea class="flex-1">
            <ShareBaseNav {base} />
          </ScrollArea>
        </div>
      </Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane class="flex h-screen flex-col" defaultSize={85}>
        <BaseHeader {base} readonly={true} />
        <section class="flex-1">
          <slot />
        </section>
      </Resizable.Pane>
    </Resizable.PaneGroup>
  {/if}
</main>
