<script lang="ts">
  import CircleUser from "lucide-svelte/icons/circle-user"
  import * as Tabs from "$lib/components/ui/tabs"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import {
    ChevronDownIcon,
    Code2Icon,
    CodeIcon,
    CopyPlusIcon,
    DatabaseIcon,
    FingerprintIcon,
    FormInputIcon,
    HardDriveIcon,
    PencilIcon,
    PlusCircleIcon,
    SheetIcon,
    TextCursorInputIcon,
  } from "lucide-svelte"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js"
  import { getTable } from "$lib/store/table.store"
  import { tab, isFormTab, formId, developerTab, isAuthTab, isDeveloperTab } from "$lib/store/tab.store"
  import RecordUpdating from "../record-updating/record-updating.svelte"
  import CreateFormButton from "../forms/create-form-button.svelte"
  import CreateViewButton from "../view/create-view-button.svelte"
  import { derived } from "svelte/store"
  import { page } from "$app/stores"
  import { DELETE_VIEW, DUPLICATE_VIEW, UPDATE_VIEW, toggleModal } from "$lib/store/modal.store"
  import { getBaseById } from "$lib/store/base.store"

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

<header class="bg-muted/40 flex h-12 items-center gap-4 border-b px-4 lg:px-6">
  <div class="relative flex w-full flex-1 items-center justify-between">
    <div class="relative flex items-center gap-4">
      <Breadcrumb.Root>
        <Breadcrumb.List>
          {#if base}
            <Breadcrumb.Item>
              <Breadcrumb.Link class="flex items-center gap-2" href={`/bases/${$table.baseId}`}>
                <HardDriveIcon class="h-3 w-3" />
                {base.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
          {/if}
          <Breadcrumb.Item>
            <Breadcrumb.Link class="flex items-center gap-2" href={`/t/${$table.id.value}`}>
              <DatabaseIcon class="h-3 w-3" />
              {$table.name.value}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          {#if $isFormTab}
            {#if forms.length}
              <Breadcrumb.Item>
                <FormInputIcon class="h-3 w-3" />
                Forms
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                  <Button size="sm" variant="link" class="pl-0 pr-0" builders={[builder]}>{currentForm?.name}</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-[200px]">
                  <DropdownMenu.Group>
                    <DropdownMenu.Label>Forms</DropdownMenu.Label>
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
                  <PlusCircleIcon class="h-4 w-4" />
                </CreateFormButton>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Create Form</p>
              </Tooltip.Content>
            </Tooltip.Root>
          {:else if $isAuthTab}
            <Breadcrumb.Item>
              <FingerprintIcon class="h-3 w-3" />
              Auth
            </Breadcrumb.Item>
          {:else if $isDeveloperTab}
            <Breadcrumb.Item>
              <Code2Icon class="h-3 w-3" />
              Developer
            </Breadcrumb.Item>
          {:else}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Breadcrumb.Item class="text-xs">
                  <Breadcrumb.Page class="flex items-center gap-1">
                    {view.name.value}
                    <ChevronDownIcon class="text-muted-foreground h-4 w-4" />
                  </Breadcrumb.Page>
                </Breadcrumb.Item>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(UPDATE_VIEW)}>
                  <PencilIcon class="mr-2 h-3 w-3" />
                  Update View Name
                </DropdownMenu.Item>
                <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(DUPLICATE_VIEW)}>
                  <CopyPlusIcon class="mr-2 h-3 w-3" />
                  Duplicate View
                </DropdownMenu.Item>
                {#if !view.isDefault}
                  <DropdownMenu.Item
                    class="text-xs text-red-500 hover:bg-red-200 hover:text-red-500"
                    on:click={() => toggleModal(DELETE_VIEW)}
                  >
                    <CopyPlusIcon class="mr-2 h-3 w-3" />
                    Delete View
                  </DropdownMenu.Item>
                {/if}
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <CreateViewButton class="mt-0" size="icon" variant="ghost">
              <PlusCircleIcon class="h-4 w-4" />
            </CreateViewButton>
          {/if}
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <RecordUpdating />
    </div>

    <Tabs.Root
      value={$tab === "data" || !$tab ? "data" : $tab}
      onValueChange={(value) => {
        if (!$tab && value === "data") {
          return
        }

        tab.set(value === "data" ? "" : value ?? "")
        if (value === "developer" && !$developerTab) {
          $developerTab = "openapi"
        }
      }}
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
    >
      <Tabs.List>
        <Tabs.Trigger value="data">
          <SheetIcon class="mr-2 h-4 w-4" />
          Data
        </Tabs.Trigger>
        <Tabs.Trigger value="form">
          <TextCursorInputIcon class="mr-2 h-4 w-4" />
          Forms
        </Tabs.Trigger>
        <Tabs.Trigger value="auth">
          <FingerprintIcon class="mr-2 h-4 w-4" />
          Auth
        </Tabs.Trigger>
        <Tabs.Trigger value="developer">
          <Code2Icon class="mr-2 h-4 w-4" />
          Developer
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
          <CircleUser class="h-5 w-5" />
          <span class="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>My Account</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Settings</DropdownMenu.Item>
        <DropdownMenu.Item>Support</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Logout</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</header>
