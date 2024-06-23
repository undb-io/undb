<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { PlusIcon, SearchIcon } from "lucide-svelte"
  import { commandOpen } from "../command/command.store"
  import { CREATE_BASE_MODAL, toggleModal } from "$lib/store/modal.store"
</script>

<div class="w-full space-y-2">
  <Button
    variant="outline"
    size="sm"
    class="flex w-full items-center justify-between"
    on:click={() => ($commandOpen = true)}
  >
    <span class="inline-flex items-center">
      <SearchIcon class="text-muted-foreground mr-2 h-3 w-3" />
      Search
    </span>
    <span>
      <code class="bg-muted relative rounded border border-gray-300 px-[0.3rem] py-[0.2rem] font-mono text-xs">
        ⌘ + K
      </code>
    </span>
  </Button>

  <Button on:click={() => toggleModal(CREATE_BASE_MODAL)} variant="link" size="sm">
    <PlusIcon class="mr-2 h-3 w-3" />
    Create New Base
  </Button>
</div>
