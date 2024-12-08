<script lang="ts">
  import DashboardWidgets from "$lib/components/blocks/dashboard/dashboard-widgets.svelte"
  import AddDashboardWidgetButton from "$lib/components/blocks/widget/add-dashboard-widget-button.svelte"
  import { getDashboard } from "$lib/store/dashboard.store"
  import { derived } from "svelte/store"
  import { GaugeIcon, EllipsisIcon, PencilIcon } from "lucide-svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { TrashIcon } from "lucide-svelte"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import Button from "$lib/components/ui/button/button.svelte"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { goto, invalidate, invalidateAll } from "$app/navigation"
  import * as Dialog from "$lib/components/ui/dialog"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { CopyIcon } from "lucide-svelte"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { defaults, superForm } from "sveltekit-superforms"
  import { updateDashboardDTO } from "@undb/dashboard"
  import { Textarea } from "$lib/components/ui/textarea"
  import { Loader2Icon } from "lucide-svelte"
  import { toast } from "svelte-sonner"
  import ShareButton from "$lib/components/blocks/share/share-button.svelte"
  import { LL } from "@undb/i18n/client"
  import { getIsPlayground } from "$lib/store/playground.svelte"

  const dashboard = getDashboard()

  const isPlayground = getIsPlayground()

  const widgets = derived(dashboard, ($dashboard) => $dashboard?.widgets)

  let deleteDialogOpen = false

  const deleteDashboardMutation = createMutation({
    mutationFn: trpc.dashboard.delete.mutate,
    mutationKey: ["dashboard", "delete", $dashboard.id.value],
    onSuccess: async () => {
      await invalidateAll()
      goto("/")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const deleteDashboard = () => {
    $deleteDashboardMutation.mutate({ id: $dashboard.id.value })
  }

  let updateDialogOpen = false

  const updateDashboardForm = superForm(
    defaults(
      {
        name: $dashboard.name.value,
        description: $dashboard.description,
      },
      zodClient(updateDashboardDTO),
    ),
    {
      validators: zodClient(updateDashboardDTO),
      SPA: true,
      dataType: "json",
      onSubmit: (data) => {
        validateForm({ update: true })
      },
      onUpdate: (data) => {
        if (!data.form.valid) {
          console.log(data.form.errors)
          return
        }

        $updateDashboardMutation.mutate({
          dashboardId: $dashboard.id.value,
          name: data.form.data.name,
          description: data.form.data.description,
        })
      },
    },
  )

  const { form: formData, enhance, validateForm } = updateDashboardForm

  const updateDashboardMutation = createMutation({
    mutationFn: trpc.dashboard.update.mutate,
    mutationKey: ["dashboard", "update", $dashboard.id.value],
  })

  let duplicateDialogOpen = false

  const duplicateDashboardMutation = createMutation({
    mutationFn: trpc.dashboard.duplicate.mutate,
    mutationKey: ["dashboard", "duplicate", $dashboard.id.value],
    onSuccess: async (data) => {
      await invalidateAll()
      await goto(`/dashboards/${data}`)
    },
  })

  const duplicateDashboard = () => {
    $duplicateDashboardMutation.mutate({ id: $dashboard.id.value })
  }
</script>

<div class="flex h-full flex-col">
  <header class="flex items-center justify-between border-b px-4 py-2">
    <h1 class="flex items-center text-sm font-medium text-gray-700">
      <GaugeIcon class="mr-2 size-4" />
      {$dashboard.name.value}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <EllipsisIcon class="text-muted-foreground ml-4 size-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            <DropdownMenu.Item class="text-xs" on:click={() => (updateDialogOpen = true)}>
              <PencilIcon class="mr-2 size-3" />
              {$LL.dashboard.updateName()}
            </DropdownMenu.Item>
            <DropdownMenu.Item class="text-xs" on:click={() => (duplicateDialogOpen = true)}>
              <CopyIcon class="mr-2 size-3" />
              {$LL.dashboard.duplicateDashboard()}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              class="text-destructive text-xs hover:!bg-red-100 hover:!text-red-500"
              on:click={() => (deleteDialogOpen = true)}
            >
              <TrashIcon class="mr-2 size-3" />
              {$LL.dashboard.deleteDashboard()}
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </h1>
    <div class="flex items-center gap-2">
      {#if !isPlayground}
        <ShareButton
          type="dashboard"
          id={$dashboard.id.value}
          onSuccess={async () => {
            await invalidate(`undb:dashboard:${$dashboard.id.value}`)
          }}
        />
      {/if}

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
      <AlertDialog.Title>{$LL.dashboard.confirmDeleteDashboard()}</AlertDialog.Title>
      <AlertDialog.Description>
        {$LL.dashboard.confirmDeleteDashboardDescription()}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
      <AlertDialog.Action asChild>
        <Button variant="destructive" on:click={deleteDashboard}>
          {#if $deleteDashboardMutation.isPending}
            <Loader2Icon class="mr-2 size-4" />
          {/if}
          {$LL.common.delete()}
        </Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={duplicateDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$LL.dashboard.duplicateDashboardConfirm()}</AlertDialog.Title>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
      <AlertDialog.Action asChild let:builder>
        <Button on:click={duplicateDashboard} builders={[builder]}>
          {$LL.common.duplicate()}
        </Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={updateDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$LL.dashboard.updateDashboard()}</Dialog.Title>
    </Dialog.Header>

    <form method="POST" use:enhance>
      <Form.Field form={updateDashboardForm} name="name">
        <Form.Control let:attrs>
          <Form.Label>{$LL.common.name()}</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field form={updateDashboardForm} name="description">
        <Form.Control let:attrs>
          <Form.Label>{$LL.common.description()}</Form.Label>
          <Textarea {...attrs} bind:value={$formData.description} />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button>{$LL.common.update()}</Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
