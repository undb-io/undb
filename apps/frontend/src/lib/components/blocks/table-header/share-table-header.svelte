<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs"
  import { DatabaseIcon, FormInputIcon, HardDriveIcon, SheetIcon, TextCursorInputIcon } from "lucide-svelte"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js"
  import { getTable } from "$lib/store/table.store"
  import { tab, isFormTab, formId } from "$lib/store/tab.store"
  import { derived } from "svelte/store"
  import { page } from "$app/stores"
  import { getBaseById } from "$lib/store/base.store"
  import { LL } from "@undb/i18n/client"
  const table = getTable()
  $: base = $getBaseById($table.baseId)

  $: viewId = derived([page], ([$page]) => {
    return $page.params.viewId
  })
  $: view = $table.views.getViewById($viewId)
  $: forms = $table.forms?.props ?? []

  $: currentFormId = $formId ? $formId : forms[0]?.id
  $: currentForm = forms.find((form) => form.id === currentFormId)
</script>

<header class="bg-muted/40 flex h-12 items-center gap-4 border-b px-4 py-3 lg:px-6">
  <div class="relative flex w-full flex-1 items-center justify-between">
    <div class="relative flex items-center gap-4">
      <Breadcrumb.Root>
        <Breadcrumb.List>
          {#if base}
            <Breadcrumb.Item>
              <Breadcrumb.Link class="flex items-center gap-2">
                <HardDriveIcon class="h-4 w-4" />
                {base.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
          {/if}
          <Breadcrumb.Item>
            <Breadcrumb.Link class="flex items-center gap-2">
              <DatabaseIcon class="h-4 w-4" />
              {$table.name.value}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          {#if $isFormTab}
            {#if forms.length}
              <Breadcrumb.Item>
                <FormInputIcon class="h-4 w-4" />
                {$LL.table.form.label()}
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                {currentForm?.name}
              </Breadcrumb.Item>
            {/if}
          {:else}
            <Breadcrumb.Item class="text-xs">
              <Breadcrumb.Page class="flex items-center gap-1">
                {view.name.value}
              </Breadcrumb.Page>
            </Breadcrumb.Item>
          {/if}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </div>

    {#if forms.length}
      <Tabs.Root
        value={$tab === "data" || !$tab ? "data" : $tab}
        onValueChange={(value) => {
          if (!$tab && value === "data") {
            return
          }

          tab.set(value === "data" ? "" : (value ?? ""))
        }}
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
      >
        <Tabs.List>
          <Tabs.Trigger value="data">
            <SheetIcon class="mr-2 h-4 w-4" />
            {$LL.common.data()}
          </Tabs.Trigger>
          <Tabs.Trigger value="form">
            <TextCursorInputIcon class="mr-2 h-4 w-4" />
            {$LL.table.form.label()}
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    {/if}
  </div>
</header>
