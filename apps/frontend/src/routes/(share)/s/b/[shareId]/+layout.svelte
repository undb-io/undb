<script lang="ts">
  import ShareBaseNav from "$lib/components/blocks/base/share-base-nav.svelte"
  import * as Resizable from "$lib/components/ui/resizable"
  import type { PaneAPI } from "paneforge"
  import type { LayoutData } from "./$types"
  import Logo from "$lib/images/logo.svg"
  import { Button } from "$lib/components/ui/button"
  import { page } from "$app/stores"
  import { LL } from "@undb/i18n/client"

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

            <Button href={`/create-from-share/${$page.params.shareId}`} size="sm">
              {$LL.template.useThisTemplate()}
            </Button>
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
