<script lang="ts">
  import DashboardWidgets from "$lib/components/blocks/dashboard/dashboard-widgets.svelte"
  import AddDashboardWidgetButton from "$lib/components/blocks/widget/add-dashboard-widget-button.svelte"
  import { getDashboard } from "$lib/store/dashboard.store"
  import { derived } from "svelte/store"
  import { GaugeIcon, EllipsisIcon } from "lucide-svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { TrashIcon } from "lucide-svelte"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import Button from "$lib/components/ui/button/button.svelte"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { goto, invalidateAll } from "$app/navigation"

  const dashboard = getDashboard()

  const widgets = derived(dashboard, ($dashboard) => $dashboard?.widgets)

  let deleteDialogOpen = false

  const deleteDashboardMutation = createMutation({
    mutationFn: trpc.dashboard.delete.mutate,
    mutationKey: ["dashboard", "delete", $dashboard.id.value],
    onSuccess: async () => {
      await invalidateAll()
      goto("/")
    },
  })

  const deleteDashboard = () => {
    $deleteDashboardMutation.mutate({ id: $dashboard.id.value })
  }
</script>

<div class="flex h-full flex-col">
  <header class="flex items-center justify-between border-b px-4 py-2">
    <h1 class="flex items-center text-lg font-medium">
      <GaugeIcon class="mr-2 size-5" />
      {$dashboard.name.value}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <EllipsisIcon class="text-muted-foreground ml-2 size-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            <DropdownMenu.Item on:click={() => (deleteDialogOpen = true)}>
              <TrashIcon class="mr-2 size-3" />
              Delete Dashboard
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </h1>
    <div class="flex items-center gap-2">
      <!-- <ShareButton
        type="dashboard"
        id={$dashboard.id.value}
        onSuccess={() => {
          invalidate(`undb:dashboard:${$dashboard.id.value}`)
        }}
      /> -->

      <AddDashboardWidgetButton variant="outline" size="sm" />
    </div>
  </header>
  {#if $widgets?.value.length}
    <main class="px-4 py-4">
      <DashboardWidgets />
    </main>
  {:else}
    <div class="flex flex-1 items-center justify-center">
      <AddDashboardWidgetButton />
    </div>
  {/if}
</div>

<AlertDialog.Root bind:open={deleteDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete Dashboard?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your dashboard and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action asChild let:builder>
        <Button variant="destructive" on:click={deleteDashboard} builders={[builder]}>Delete</Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
