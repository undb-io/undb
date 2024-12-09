<script lang="ts">
  import { IMPORT_TEMPLATE_MODAL, IMPORT_TABLE_MODAL, openModal } from "$lib/store/modal.store"
  import { Button } from "$lib/components/ui/button"
  import { LL } from "@undb/i18n/client"
  import { ImportIcon } from "lucide-svelte"
</script>

<div class="flex items-center gap-2 border-b p-2">
  <Button
    size="xs"
    variant="outline"
    on:click={() => {
      openModal(IMPORT_TEMPLATE_MODAL)
    }}
  >
    <ImportIcon class="mr-2 h-3 w-3" />
    {$LL.base.importFromTemplate()}
  </Button>
  <Button
    size="xs"
    variant="outline"
    on:click={() => {
      openModal(IMPORT_TABLE_MODAL)
    }}
  >
    <ImportIcon class="mr-2 h-3 w-3" />
    {$LL.table.common.import()}
  </Button>
</div>
