<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { preferences } from "$lib/store/persisted.store"
  import {
    PanelLeftOpenIcon,
    ChevronDownIcon,
    ChevronsUpDownIcon,
    Code2Icon,
    CopyPlusIcon,
    DatabaseIcon,
    DownloadIcon,
    FingerprintIcon,
    FormInputIcon,
    HardDriveIcon,
    PencilIcon,
    PlusCircleIcon,
    SheetIcon,
    TextCursorInputIcon,
    FileJsonIcon,
    FileTextIcon,
    FileSpreadsheet,
    TrashIcon,
    CopyIcon,
  } from "lucide-svelte"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js"
  import { getTable } from "$lib/store/table.store"
  import { tab, isFormTab, formId, developerTab, isAuthTab, isDeveloperTab } from "$lib/store/tab.store"
  import CreateFormButton from "../forms/create-form-button.svelte"
  import CreateViewButton from "../view/create-view-button.svelte"
  import { derived } from "svelte/store"
  import { page } from "$app/stores"
  import {
    DELETE_TABLE_MODAL,
    DELETE_VIEW,
    DUPLICATE_TABLE_MODAL,
    DUPLICATE_VIEW,
    SET_DEFAULT_VIEW,
    UPDATE_TABLE_MODAL,
    UPDATE_VIEW,
    toggleModal,
  } from "$lib/store/modal.store"
  import { getBaseById } from "$lib/store/base.store"
  import { hasPermission } from "$lib/store/space-member.store"
  import DuplicateTable from "../duplicate-table/duplicate-table.svelte"
  import { LL } from "@undb/i18n/client"

  const table = getTable()
  $: base = $getBaseById($table.baseId)
  export let readonly = false

  $: viewId = derived([page], ([$page]) => {
    return $page.params.viewId
  })
  $: view = $table.views.getViewById($viewId)
  $: forms = $table.forms?.props ?? []

  $: currentFormId = $formId ? $formId : forms[0]?.id
  $: currentForm = forms.find((form) => form.id === currentFormId)

  const downloadView = async (type: "excel" | "csv" | "json") => {
    const res = await fetch(`/api/tables/${$table.id.value}/views/${view.id.value}/export?type=${type}`)
    const blob = await res.blob()
    const a = document.createElement("a")
    a.href = window.URL.createObjectURL(blob)
    a.download = $table.name.value + " - " + view.name.value
    a.click()
    a.remove()
  }
</script>

<header class="bg-muted/40 flex h-12 items-center gap-4 border-b px-4 py-3 lg:px-6">
  <div class="relative flex w-full flex-1 items-center justify-between">
    <div class="flex items-center gap-4">
      {#if $preferences.panelLeftCollapsed}
        <button on:click={() => preferences.update((p) => ({ ...p, panelLeftCollapsed: false }))}>
          <PanelLeftOpenIcon class="text-muted-foreground size-4" />
        </button>
      {/if}
      <div class="relative flex items-center gap-4">
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {#if base}
              <Breadcrumb.Item>
                <Breadcrumb.Link class="flex items-center gap-2" href={`/bases/${$table.baseId}`}>
                  <HardDriveIcon class="size-3" />
                  {base.name}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
            {/if}
            <Breadcrumb.Item>
              <Breadcrumb.Link class="flex items-center gap-2" href={`/t/${$table.id.value}`}>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger
                    disabled={!$hasPermission("table:update") && !$hasPermission("table:delete")}
                    class="flex max-w-[200px] items-center gap-2 overflow-hidden"
                    title={$table.name.value}
                  >
                    <DatabaseIcon class="size-3" />
                    <span class="truncate text-xs text-gray-700">
                      {$table.name.value}
                    </span>
                    <ChevronDownIcon class="size-3" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content class="w-[200px]">
                    {#if $hasPermission("table:update")}
                      <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(UPDATE_TABLE_MODAL)}>
                        <PencilIcon class="mr-2 size-3" />
                        {$LL.table.common.updateName()}
                      </DropdownMenu.Item>
                    {/if}
                    {#if $hasPermission("table:create")}
                      <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(DUPLICATE_TABLE_MODAL)}>
                        <CopyIcon class="mr-2 size-3" />
                        {$LL.table.common.duplicateTable()}
                      </DropdownMenu.Item>
                    {/if}
                    {#if $hasPermission("table:delete")}
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item
                        on:click={() => toggleModal(DELETE_TABLE_MODAL)}
                        class="text-xs text-red-500 hover:!bg-red-50 hover:!text-red-500"
                      >
                        <TrashIcon class="mr-2 size-3" />
                        {$LL.table.common.deleteTable()}
                      </DropdownMenu.Item>
                    {/if}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            {#if $isFormTab}
              {#if forms.length}
                <Breadcrumb.Item>
                  <FormInputIcon class="size-3" />
                  {$LL.table.form.label()}
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild let:builder>
                    <Button
                      size="sm"
                      variant="link"
                      disabled={!$hasPermission("table:update")}
                      class="pl-0 pr-0"
                      builders={[builder]}>{currentForm?.name}</Button
                    >
                    <ChevronsUpDownIcon class="size-3" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content class="w-[200px]">
                    <DropdownMenu.Group>
                      <DropdownMenu.Label>{$LL.table.form.label()}</DropdownMenu.Label>
                      <DropdownMenu.RadioGroup
                        bind:value={currentFormId}
                        onValueChange={(value) => ($formId = value ?? null)}
                      >
                        {#each forms as form}
                          <DropdownMenu.RadioItem value={form.id}>{form.name}</DropdownMenu.RadioItem>
                        {/each}
                      </DropdownMenu.RadioGroup>
                    </DropdownMenu.Group>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              {/if}

              <Tooltip.Root>
                <Tooltip.Trigger>
                  <CreateFormButton class="mt-0" size="icon" variant="ghost">
                    <PlusCircleIcon class="size-3" />
                  </CreateFormButton>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>{$LL.table.form.create()}</p>
                </Tooltip.Content>
              </Tooltip.Root>
            {:else if $isAuthTab}
              <Breadcrumb.Item>
                <FingerprintIcon class="size-3" />
                {$LL.common.auth()}
              </Breadcrumb.Item>
            {:else if $isDeveloperTab}
              <Breadcrumb.Item>
                <Code2Icon class="size-3" />
                {$LL.common.developer()}
              </Breadcrumb.Item>
            {:else}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Breadcrumb.Item class="text-xs">
                    <Breadcrumb.Page class="flex items-center gap-1">
                      {view.name.value}
                      {#if $hasPermission("table:update")}
                        <ChevronDownIcon class="text-muted-foreground size-3" />
                      {/if}
                    </Breadcrumb.Page>
                  </Breadcrumb.Item>
                </DropdownMenu.Trigger>
                {#if $hasPermission("table:update")}
                  <DropdownMenu.Content class="w-[200px]">
                    <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(UPDATE_VIEW)}>
                      <PencilIcon class="mr-2 size-3" />
                      {$LL.table.view.updateName()}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(DUPLICATE_VIEW)}>
                      <CopyPlusIcon class="mr-2 size-3" />
                      {$LL.table.view.duplicateView()}
                    </DropdownMenu.Item>
                    <DropdownMenu.Sub>
                      <DropdownMenu.SubTrigger class="text-xs">
                        <DownloadIcon class="mr-2 size-3" />
                        {$LL.table.view.downloadView()}
                      </DropdownMenu.SubTrigger>
                      <DropdownMenu.SubContent class="w-[200px]">
                        <DropdownMenu.Item class="text-xs" on:click={() => downloadView("excel")}>
                          <FileSpreadsheet class="mr-2 size-3" />
                          {$LL.table.view.downloadAsExcel()}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item class="text-xs" on:click={() => downloadView("csv")}>
                          <FileTextIcon class="mr-2 size-3" />
                          {$LL.table.view.downloadAsCSV()}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item class="text-xs" on:click={() => downloadView("json")}>
                          <FileJsonIcon class="mr-2 size-3" />
                          {$LL.table.view.downloadAsJSON()}
                        </DropdownMenu.Item>
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>
                    {#if !view.isDefault}
                      <DropdownMenu.Item class="text-xs " on:click={() => toggleModal(SET_DEFAULT_VIEW)}>
                        <PencilIcon class="mr-2 size-3" />
                        {$LL.table.view.setAsDefaultView()}
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item
                        class="text-xs text-red-500 hover:!bg-red-100 hover:!text-red-500"
                        on:click={() => toggleModal(DELETE_VIEW)}
                      >
                        <TrashIcon class="mr-2 size-3" />
                        {$LL.table.view.deleteView()}
                      </DropdownMenu.Item>
                    {/if}
                  </DropdownMenu.Content>
                {/if}
              </DropdownMenu.Root>

              <CreateViewButton
                tableId={$table.id.value}
                viewNames={$table.views.views.map((v) => v.name.value)}
                class="text-muted-foreground mt-0 p-0 hover:bg-transparent"
                variant="ghost"
              >
                <PlusCircleIcon class="size-4" />
              </CreateViewButton>
            {/if}
          </Breadcrumb.List>
        </Breadcrumb.Root>

        <!-- <RecordUpdating /> -->
      </div>
    </div>

    <Tabs.Root
      value={$tab === "data" || !$tab ? "data" : $tab}
      onValueChange={(value) => {
        if (!$tab && value === "data") {
          return
        }

        tab.set(value === "data" ? null : (value ?? null))
        if (value === "developer" && !$developerTab) {
          $developerTab = "openapi"
        }
      }}
    >
      <Tabs.List>
        <Tabs.Trigger value="data">
          <SheetIcon class="mr-2 size-3" />
          {$LL.common.data()}
        </Tabs.Trigger>
        <Tabs.Trigger value="form">
          <TextCursorInputIcon class="mr-2 size-3" />
          {$LL.table.form.label()}
        </Tabs.Trigger>
        <Tabs.Trigger value="auth">
          <FingerprintIcon class="mr-2 size-3" />
          {$LL.common.auth()}
        </Tabs.Trigger>
        <Tabs.Trigger value="developer">
          <Code2Icon class="mr-2 size-3" />
          {$LL.common.developer()}
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  </div>
</header>

<DuplicateTable />
