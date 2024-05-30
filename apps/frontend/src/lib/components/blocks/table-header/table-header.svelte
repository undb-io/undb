<script lang="ts">
  import CircleUser from "lucide-svelte/icons/circle-user"
  import LineChart from "lucide-svelte/icons/line-chart"
  import Package from "lucide-svelte/icons/package"
  import Home from "lucide-svelte/icons/home"
  import ShoppingCart from "lucide-svelte/icons/shopping-cart"
  import Menu from "lucide-svelte/icons/menu"
  import Users from "lucide-svelte/icons/users"
  import { Badge } from "$lib/components/ui/badge/index.js"
  import * as Tabs from "$lib/components/ui/tabs"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js"
  import * as Sheet from "$lib/components/ui/sheet/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import {
    DatabaseIcon,
    FileSlidersIcon,
    Package2,
    PlusCircleIcon,
    SheetIcon,
    TextCursorInputIcon,
  } from "lucide-svelte"
  import CreateTableButton from "../create-table/create-table-button.svelte"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js"
  import { getTable } from "$lib/store/table.store"
  import { tab, isFormTab, formId, developerTab } from "$lib/store/tab.store"
  import RecordUpdating from "../record-updating/record-updating.svelte"
  import Separator from "$lib/components/ui/separator/separator.svelte"
  import CreateFormButton from "../forms/create-form-button.svelte"

  const table = getTable()
  $: view = $table.views.getViewById()
  $: forms = $table.forms?.props ?? []

  $: currentFormId = $formId ? $formId : forms[0]?.id
  $: currentForm = forms.find((form) => form.id === currentFormId)
</script>

<header class="bg-muted/40 flex h-12 items-center gap-4 border-b px-4 lg:px-6">
  <Sheet.Root>
    <Sheet.Trigger asChild let:builder>
      <Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span>
      </Button>
    </Sheet.Trigger>
    <Sheet.Content side="left" class="flex flex-col">
      <nav class="grid gap-2 text-lg font-medium">
        <a href="##" class="flex items-center gap-2 text-lg font-semibold">
          <Package2 class="h-6 w-6" />
          <span class="sr-only">Acme Inc</span>
        </a>
        <a
          href="##"
          class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
        >
          <Home class="h-5 w-5" />
          Dashboard
        </a>
        <a
          href="##"
          class="bg-muted text-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
        >
          <ShoppingCart class="h-5 w-5" />
          Orders
          <Badge class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge>
        </a>
        <a
          href="##"
          class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
        >
          <Package class="h-5 w-5" />
          Products
        </a>
        <a
          href="##"
          class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
        >
          <Users class="h-5 w-5" />
          Customers
        </a>
        <a
          href="##"
          class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
        >
          <LineChart class="h-5 w-5" />
          Analytics
        </a>
      </nav>
      <div class="mt-auto">
        <CreateTableButton />
      </div>
    </Sheet.Content>
  </Sheet.Root>
  <div class="relative flex w-full flex-1 items-center justify-between">
    <div class="relative flex items-center gap-4">
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link class="flex items-center gap-2" href={`/t/${$table.id.value}`}>
              <DatabaseIcon class="h-3 w-3" />
              {$table.name.value}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          {#if $isFormTab}
            {#if forms.length}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                  <Button size="sm" variant="link" class="pl-0" builders={[builder]}>{currentForm?.name}</Button>
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
          {:else}
            <Breadcrumb.Item class="text-xs">
              <Breadcrumb.Page>{view.name.value}</Breadcrumb.Page>
            </Breadcrumb.Item>
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
        <Tabs.Trigger value="developer">
          <FileSlidersIcon class="mr-2 h-4 w-4" />
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
