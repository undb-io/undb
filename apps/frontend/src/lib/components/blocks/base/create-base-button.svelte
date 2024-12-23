<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CREATE_BASE_MODAL, IMPORT_TEMPLATE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { hasPermission } from "$lib/store/space-member.store"
  import { CirclePlusIcon, PackageIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"
</script>

{#if $hasPermission("base:create")}
  <Button class="w-52" on:click={() => toggleModal(CREATE_BASE_MODAL)} {...$$restProps}>
    <CirclePlusIcon class="mr-2 size-4" />
    {$LL.base.createBase()}
  </Button>
  <Button class="w-52" on:click={() => toggleModal(IMPORT_TEMPLATE_MODAL)} {...$$restProps}>
    <PackageIcon class="mr-2 size-4 shrink-0" />
    {$LL.base.importFromTemplate()}
  </Button>
{/if}
