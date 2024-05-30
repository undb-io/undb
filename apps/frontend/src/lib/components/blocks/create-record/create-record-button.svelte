<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { BetweenHorizonalEnd, ChevronDownIcon } from "lucide-svelte"
  import { getTable } from "$lib/store/table.store"
  import { formId } from "$lib/store/tab.store"
  import { cn } from "$lib/utils"
  import { CREATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"

  const table = getTable()

  $: forms = $table.forms?.props ?? []
  $: hasForms = forms.length > 0
</script>

<div class="flex items-center gap-0">
  <Button
    size="sm"
    variant="outline"
    on:click={() => {
      $formId = null
      toggleModal(CREATE_RECORD_MODAL)
    }}
    {...$$restProps}
    class={cn(hasForms && "rounded-r-none border-r-0", $$restProps.class)}
  >
    <BetweenHorizonalEnd class="mr-1 h-4 w-4" />
    Create Record
  </Button>

  {#if hasForms}
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="sm" variant="outline" class="rounded-l-none border-l px-2">
          <ChevronDownIcon class="h-3 w-3 text-sm font-light" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-[200px]">
        <DropdownMenu.Group>
          <DropdownMenu.Label>Create By Form</DropdownMenu.Label>
          <DropdownMenu.Separator />
          {#each forms as form}
            <DropdownMenu.Item
              on:click={() => {
                $formId = form.id
                toggleModal(CREATE_RECORD_MODAL)
              }}
            >
              {form.name}
            </DropdownMenu.Item>
          {/each}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  {/if}
</div>
