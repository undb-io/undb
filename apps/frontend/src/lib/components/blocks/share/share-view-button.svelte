<script lang="ts">
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button"
  import { Switch } from "$lib/components/ui/switch"
  import { Label } from "$lib/components/ui/label"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { CopyIcon, ShareIcon, CopyCheckIcon } from "lucide-svelte"
  import { derived } from "svelte/store"
  import * as Popover from "$lib/components/ui/popover"
  import { shareStore } from "$lib/store/share.store"
  import { invalidate } from "$app/navigation"
  import { Input } from "$lib/components/ui/input"
  import { getShareViewUrl } from "@undb/share"
  import { copyToClipboard } from "@svelte-put/copy"
  import { toast } from "svelte-sonner"

  const t = getTable()
  const viewId = derived([page, t], ([$page, $table]) => $page.params.viewId ?? $table.views.getDefaultView().id.value)

  const enableShareMutation = createMutation({
    mutationFn: trpc.share.enable.mutate,
    onSuccess(data, variables, context) {
      invalidate(`table:${$t.id.value}`)
    },
  })

  const enableShare = async () => {
    if (share) {
      share.enabled = true
    }
    $enableShareMutation.mutate({
      target: {
        type: "view",
        id: $viewId,
      },
    })
  }

  const disableShareMutation = createMutation({
    mutationFn: trpc.share.disable.mutate,
    onSuccess(data, variables, context) {
      invalidate(`table:${$t.id.value}`)
    },
  })

  const disableShare = async () => {
    if (share) {
      share.enabled = false
    }
    $disableShareMutation.mutate({
      target: {
        type: "view",
        id: $viewId,
      },
    })
  }

  $: share = $shareStore.get($viewId)
  $: enabled = share?.enabled
  let open = false

  $: url = getShareViewUrl(window.location.origin, $viewId)
  let copied = false
  const copy = () => {
    copyToClipboard(url)
    copied = true
    setTimeout(() => {
      copied = false
    }, 2000)
    toast.success("Copied to clipboard")
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button
      disabled={$enableShareMutation.isPending || $disableShareMutation.isPending}
      builders={[builder]}
      variant={open || enabled ? "secondary" : "ghost"}
      size="sm"
    >
      <ShareIcon class="mr-1 h-4 w-4" />
      Share
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[400px]">
    <div class="-mx-4 flex justify-between px-4 pb-2">
      <h3 class="text-sm font-semibold">Share View</h3>
      <Label class="flex items-center gap-2">
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => {
            if (checked) {
              enableShare()
            } else {
              disableShare()
            }
          }}
        />
        {enabled ? "enable" : "disable"}
      </Label>
    </div>

    {#if enabled}
      <div class="-mx-4 border-t px-4 pt-2">
        <div class="flex items-center gap-2">
          <Input
            value={url}
            readonly
            class="flex-1 cursor-pointer"
            on:click={(e) => {
              copy()
              e.target.select()
            }}
          />
          <button type="button" on:click={copy}>
            {#if copied}
              <CopyCheckIcon class="h-4 w-4" />
            {:else}
              <CopyIcon class="h-4 w-4" />
            {/if}
          </button>
        </div>
      </div>
    {/if}
  </Popover.Content>
</Popover.Root>
