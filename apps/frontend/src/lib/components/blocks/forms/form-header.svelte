<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { getTable } from "$lib/store/table.store"
  import { ChevronDownIcon, DatabaseIcon } from "lucide-svelte"

  const table = getTable()

  $: forms = $table.forms

  $: form = forms?.props?.[0]
</script>

<nav class="flex h-10 items-center gap-2 border-b px-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link class="flex items-center" href={`/t/${$table.id.value}`}>
          <DatabaseIcon class="mr-2 h-3 w-3" />
          {$table.name.value}
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      {#if form}
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger class="flex items-center">
              {form.name}
              <ChevronDownIcon class="ml-1 h-3 w-3" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>Profile</DropdownMenu.Item>
              <DropdownMenu.Item>Billing</DropdownMenu.Item>
              <DropdownMenu.Item>Team</DropdownMenu.Item>
              <DropdownMenu.Item>Subscription</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Breadcrumb.Item>
      {/if}
    </Breadcrumb.List>
  </Breadcrumb.Root>
</nav>
