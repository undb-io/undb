<script lang="ts">
  import BaseHeader from "$lib/components/blocks/base/base-header.svelte"
  import ShareBaseNav from "$lib/components/blocks/base/share-base-nav.svelte"
  import * as Resizable from "$lib/components/ui/resizable"
  import type { PaneAPI } from "paneforge"
  import type { LayoutData } from "./$types"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import Logo from "$lib/images/logo.svg"
  import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-svelte"

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
        collapsible
        class="bg-muted/40 hidden border-r md:block"
        defaultSize={20}
        minSize={15}
        maxSize={30}
      >
        <div class="flex h-full max-h-screen flex-col gap-2">
          <div class="flex justify-between border-b px-4 py-4">
            <a href="https://undb.io" class="inline-flex items-center gap-2" target="_blank" rel="noopener noreferrer">
              <img src={Logo} alt="Logo" class="h-6 w-6" />
              <span class="font-bold"> Undb </span>
            </a>

            <!-- <button on:click={() => (collapsed = !collapsed)}>
              {#if collapsed}
                <PanelLeftOpenIcon class="h-5 w-5" />
              {:else}
                <PanelLeftCloseIcon class="h-5 w-5" />
              {/if}
            </button> -->
          </div>
          <div class="w-full flex-1 overflow-y-auto">
            <ShareBaseNav {base} />
          </div>
        </div>
      </Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane class="grid h-screen" defaultSize={85}>
        <slot />
      </Resizable.Pane>
    </Resizable.PaneGroup>
  {/if}
</main>
