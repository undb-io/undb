<script lang="ts">
  import { page } from "$app/stores"
  import { Button } from "$lib/components/ui/button"
  import { Switch } from "$lib/components/ui/switch"
  import { Label } from "$lib/components/ui/label"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { ShareIcon } from "lucide-svelte"
  import { derived } from "svelte/store"
  import * as Popover from "$lib/components/ui/popover"

  const t = getTable()
  const viewId = derived([page, t], ([$page, $table]) => $page.params.viewId ?? $table.views.getDefaultView().id.value)

  const enableShareMutation = createMutation({
    mutationFn: trpc.share.enable.mutate,
  })

  const enableShare = async () => {
    $enableShareMutation.mutate({
      target: {
        type: "view",
        id: $viewId,
      },
    })
  }

  const disableShareMutation = createMutation({
    mutationFn: trpc.share.disable.mutate,
  })

  const disableShare = async () => {
    $disableShareMutation.mutate({
      target: {
        type: "view",
        id: $viewId,
      },
    })
  }

  let enabled = false
  let open = false
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button
      disabled={$enableShareMutation.isPending || $disableShareMutation.isPending}
      builders={[builder]}
      variant={!open ? "ghost" : "secondary"}
      size="sm"
    >
      <ShareIcon class="mr-1 h-4 w-4" />
      Share
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[300px]">
    <Label class="flex items-center gap-2">
      <Switch
        bind:checked={enabled}
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
  </Popover.Content>
</Popover.Root>
