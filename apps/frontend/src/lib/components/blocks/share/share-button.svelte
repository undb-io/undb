<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Switch } from "$lib/components/ui/switch"
  import { Label } from "$lib/components/ui/label"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { CopyIcon, ShareIcon, CopyCheckIcon, ExternalLinkIcon, QrCodeIcon } from "lucide-svelte"
  import * as Popover from "$lib/components/ui/popover"
  import { shareStore } from "$lib/store/share.store.svelte"
  import { invalidate } from "$app/navigation"
  import { Input } from "$lib/components/ui/input"
  import { getIframe, getShareUrl, type IShareTarget } from "@undb/share"
  import { copyToClipboard } from "@svelte-put/copy"
  import { toast } from "svelte-sonner"
  import { cn } from "$lib/utils"
  import { hasPermission } from "$lib/store/space-member.store"
  import Textarea from "$lib/components/ui/textarea/textarea.svelte"
  import { match } from "ts-pattern"
  // @ts-ignore
  import QrCode from "svelte-qrcode"
  import * as HoverCard from "$lib/components/ui/hover-card"
  import { LL } from "@undb/i18n/client"

  export let type: IShareTarget["type"]
  export let id: IShareTarget["id"]

  export let onSuccess: () => void = () => {}

  const enableShareMutation = createMutation({
    mutationKey: ["share", "enable", type, id],
    mutationFn: trpc.share.enable.mutate,
    async onSuccess(data, variables, context) {
      if ($t) {
        await invalidate(`undb:table:${$t.id.value}`)
      }
      onSuccess()
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const enableShare = async () => {
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
    async onSuccess(data, variables, context) {
      if ($t) {
        await invalidate(`undb:table:${$t.id.value}`)
      }
      onSuccess()
    },
  })

  const disableShare = async () => {
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

  $: url = share?.id ? getShareUrl(type, window.location.origin, share.id) : ""
  let copied = false
  const copy = () => {
    copyToClipboard(url)
    copied = true
    setTimeout(() => {
      copied = false
    }, 2000)
    toast.success($LL.share.copied())
  }

  $: iframe = url ? getIframe(url) : undefined
  let iframeCopied = false
  const copyIFrame = () => {
    if (!iframe) return
    copyToClipboard(iframe)
    iframeCopied = true
    setTimeout(() => {
      iframeCopied = false
    }, 2000)
    toast.success($LL.share.copied())
  }

  $: permission = match(type)
    .with("table", () => $hasPermission("share:table"))
    .with("form", () => $hasPermission("share:form"))
    .with("base", () => $hasPermission("share:base"))
    .with("view", () => $hasPermission("share:view"))
    .with("dashboard", () => $hasPermission("share:dashboard"))
    .otherwise(() => false)

  let shareIdCopied = false
  const copyShareId = async () => {
    if (!share?.id) return
    await copyToClipboard(share.id)
    shareIdCopied = true
    setTimeout(() => {
      shareIdCopied = false
    }, 2000)
    toast.success("Copied to clipboard")
  }
</script>

{#if permission}
  <Popover.Root bind:open>
    <Popover.Trigger asChild let:builder>
      <Button
        disabled={$enableShareMutation.isPending || $disableShareMutation.isPending}
        builders={[builder]}
        variant={open || enabled ? "secondary" : "ghost"}
        size="sm"
        {...$$restProps}
      >
        <ShareIcon class="mr-1 h-4 w-4" />
        {$LL.share.button()}
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-[500px]">
      <div class={cn("-mx-4 flex items-center justify-between px-4", enabled && "pb-2")}>
        <h3 class="flex items-center text-sm font-semibold">
          <ShareIcon class="mr-2 h-4 w-4" />
          {$LL.share.title()}
        </h3>
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
        </Label>
      </div>

      {#if enabled && share?.id}
        <div class="-mx-4 space-y-2 border-t px-4 pt-2">
          <div class="space-y-2">
            <p class="text-xs font-semibold">{$LL.share.shareUrl()}</p>
            <div class="flex items-center gap-2">
              <Input
                value={url}
                readonly
                class="flex-1 cursor-pointer text-gray-600"
                on:click={(e) => {
                  copy()
                  e.target.select()
                }}
              />
              <a role="button" href={url} target="_blank">
                <ExternalLinkIcon class="h-4 w-4" />
              </a>
              <button type="button" on:click={copy}>
                {#if copied}
                  <CopyCheckIcon class="h-4 w-4" />
                {:else}
                  <CopyIcon class="h-4 w-4" />
                {/if}
              </button>

              <HoverCard.Root>
                <HoverCard.Trigger>
                  <QrCodeIcon class="h-4 w-4" />
                </HoverCard.Trigger>
                <HoverCard.Content>
                  <QrCode value={url} />
                </HoverCard.Content>
              </HoverCard.Root>
            </div>
          </div>

          {#if iframe}
            <div class="space-y-2">
              <p class="text-xs font-semibold">{$LL.share.iframeUrl()}</p>
              <div class="item-center flex gap-2">
                <Textarea
                  rows={4}
                  on:click={(e) => {
                    copyIFrame()
                    e.target.select()
                  }}
                  class="flex-1 cursor-pointer text-gray-600"
                  value={iframe}
                />
                <button type="button" on:click={copyIFrame}>
                  {#if iframeCopied}
                    <CopyCheckIcon class="h-4 w-4" />
                  {:else}
                    <CopyIcon class="h-4 w-4" />
                  {/if}
                </button>
              </div>
            </div>
          {/if}

          <div class="space-y-2">
            <p class="text-xs font-semibold">{$LL.share.shareId()}</p>
            <div class="flex items-center gap-2">
              <Input
                on:click={(e) => {
                  copyShareId()
                  e.target.select()
                }}
                value={share?.id}
                readonly
                class="cursor-pointer text-gray-600"
              />
              <button
                type="button"
                on:click={(e) => {
                  copyShareId()
                }}
              >
                {#if shareIdCopied}
                  <CopyCheckIcon class="h-4 w-4" />
                {:else}
                  <CopyIcon class="h-4 w-4" />
                {/if}
              </button>
            </div>
          </div>
        </div>
      {/if}
    </Popover.Content>
  </Popover.Root>
{/if}
