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
  import { DatabaseIcon, FileSlidersIcon, Package2, SheetIcon } from "lucide-svelte"
  import CreateTableButton from "../create-table/create-table-button.svelte"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js"
  import { getTable } from "$lib/store/table.store"
  import { queryParam, ssp } from "sveltekit-search-params"

  const detail = queryParam("detail", ssp.boolean())

  const table = getTable()
  $: view = $table.views.getViewById()
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
  <div class="flex w-full flex-1 items-center justify-between">
    <div class="relative">
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link class="flex items-center gap-2" href={`/t/${$table.id.value}`}>
              <DatabaseIcon class="h-3 w-3" />
              {$table.name.value}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>{view.name.value}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </div>

    <Tabs.Root
      value={$detail ? "detail" : "data"}
      onValueChange={(value) => {
        if (!$detail && value === "data") {
          return
        }

        detail.set(value === "detail")
      }}
      class="w-[200px] -translate-x-1/2"
    >
      <Tabs.List>
        <Tabs.Trigger value="data">
          <SheetIcon class="mr-2 h-4 w-4" />
          Data
        </Tabs.Trigger>
        <Tabs.Trigger value="detail">
          <FileSlidersIcon class="mr-2 h-4 w-4" />
          Detail
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
