<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Switch } from "$lib/components/ui/switch"
  import { Label } from "$lib/components/ui/label"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { CopyIcon, ShareIcon, CopyCheckIcon } from "lucide-svelte"
  import * as Popover from "$lib/components/ui/popover"
  import { shareStore } from "$lib/store/share.store"
  import { invalidate } from "$app/navigation"
  import { Input } from "$lib/components/ui/input"
  import { getShareUrl, type IShareTarget } from "@undb/share"
  import { copyToClipboard } from "@svelte-put/copy"
  import { toast } from "svelte-sonner"

  export let type: IShareTarget["type"]
  export let id: IShareTarget["id"]

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
        type,
        id,
      },
    })
  }

  const t = getTable()
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
        type,
        id,
      },
    })
  }

  $: share = $shareStore.get(id)
  $: enabled = share?.enabled
  let open = false

  $: url = getShareUrl(type, window.location.origin, id)
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
    <div class="-mx-4 flex items-center justify-between px-4 pb-2">
      <h3 class="text-sm font-semibold">Share</h3>
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
