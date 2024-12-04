<script lang="ts">
  import { shortcut } from "@svelte-put/shortcut"
  import TableHeader from "$lib/components/blocks/table-header/table-header.svelte"
  import Forms from "$lib/components/blocks/forms/forms.svelte"
  import Auth from "$lib/components/blocks/auth/auth.svelte"
  import Developer from "$lib/components/blocks/developer/developer.svelte"
  import { isFormTab, isAuthTab, isDataTab } from "$lib/store/tab.store"
  import { CREATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { page } from "$app/stores"
  import { derived } from "svelte/store"
  import View from "$lib/components/blocks/view/view.svelte"
  import { r } from "$lib/store/records.store"

  function handleR() {
    toggleModal(CREATE_RECORD_MODAL)
  }

  const table = getTable()
  const viewId = derived(
    [page, table],
    ([$page, $table]) => $page.params.viewId ?? $table.views.getDefaultView().id.value,
  )
</script>

<TableHeader />

{#key $table.id.value}
  <main class="flex h-full flex-1 flex-col overflow-auto">
    {#if $isDataTab}
      <View {viewId} {r} shareId={undefined} />
    {:else if $isFormTab}
      <Forms />
    {:else if $isAuthTab}
      <Auth />
    {:else}
      <Developer />
    {/if}
  </main>

  {#await import("$lib/components/blocks/delete-record/confirm-delete-record.svelte") then { default: ConfirmDeleteRecord }}
    <ConfirmDeleteRecord />
  {/await}
  {#await import("$lib/components/blocks/duplicate-record/confirm-duplicate-record.svelte") then { default: ConfirmDuplicateRecord }}
    <ConfirmDuplicateRecord />
  {/await}
  {#await import("$lib/components/blocks/view/update-view-dialog.svelte") then { default: UpdateViewDialog }}
    <UpdateViewDialog {viewId} />
  {/await}
  {#await import("$lib/components/blocks/update-table/update-table-dialog.svelte") then { default: UpdateTableDialog }}
    <UpdateTableDialog />
  {/await}
  {#await import("$lib/components/blocks/view/duplicate-view-dialog.svelte") then { default: DuplicateViewDialog }}
    <DuplicateViewDialog {viewId} />
  {/await}
  {#await import("$lib/components/blocks/view/set-as-default-view.svelte") then { default: SetAsDefaultView }}
    <SetAsDefaultView {viewId} />
  {/await}
  {#await import("$lib/components/blocks/view/delete-view-dialog.svelte") then { default: DeleteViewDialog }}
    <DeleteViewDialog {viewId} />
  {/await}
  {#await import("$lib/components/blocks/delete-table/delete-table-dialog.svelte") then { default: DeleteTableDialog }}
    <DeleteTableDialog />
  {/await}
{/key}

<svelte:window
  use:shortcut={{
    trigger: {
      key: "r",
      modifier: ["ctrl"],
      callback: handleR,
    },
  }}
/>
