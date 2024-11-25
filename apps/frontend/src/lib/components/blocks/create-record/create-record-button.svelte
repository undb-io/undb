<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { BetweenHorizonalEnd, ChevronDownIcon, CirclePlusIcon, FormInputIcon } from "lucide-svelte"
  import { getTable } from "$lib/store/table.store"
  import { formId } from "$lib/store/tab.store"
  import { cn } from "$lib/utils"
  import { CREATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { hasPermission } from "$lib/store/space-member.store"
  import * as Dialog from "$lib/components/ui/dialog"
  import CreateForm from "../forms/create-form.svelte"
  import { LL } from "@undb/i18n/client"

  const table = getTable()

  $: forms = $table.forms?.props ?? []

  let createForm = false
</script>

{#if $hasPermission("record:create")}
  <div class="flex items-center gap-0">
    <Button
      size="sm"
      variant="outline"
      on:click={() => {
        $formId = null
        toggleModal(CREATE_RECORD_MODAL)
      }}
      {...$$restProps}
      class={cn("rounded-r-none border-r-0", $$restProps.class)}
    >
      <BetweenHorizonalEnd class="mr-1 h-4 w-4" />
      {$LL.table.record.create()}
    </Button>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          size={$$restProps.size ?? "sm"}
          variant={$$restProps.variant ?? "outline"}
          class="rounded-l-none border-l px-2"
        >
          <ChevronDownIcon class="h-3 w-3 text-sm font-light" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-[200px]">
        <DropdownMenu.Group>
          <DropdownMenu.Label class="flex items-center gap-2 text-xs">
            <FormInputIcon class="text-muted-foreground h-4 w-4" />
            {$LL.table.record.createByForm()}
          </DropdownMenu.Label>
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
            <DropdownMenu.Separator />
          {/each}
          <DropdownMenu.Item on:click={() => (createForm = true)}>
            <CirclePlusIcon class="mr-2 h-4 w-4" />
            {$LL.table.form.create()}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
{/if}

<Dialog.Root bind:open={createForm}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$LL.table.form.create()}</Dialog.Title>
    </Dialog.Header>

    <CreateForm onSuccess={() => (createForm = false)} />
  </Dialog.Content>
</Dialog.Root>
