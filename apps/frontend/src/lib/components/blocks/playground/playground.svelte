<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CREATE_BASE_MODAL, IMPORT_TEMPLATE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { CirclePlusIcon, PackageIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"

  type Props = {
    isLoggedIn: boolean
  }

  let { isLoggedIn, ...rest }: Props = $props()
</script>

<main class="flex w-screen flex-1 items-center justify-center">
  <div class="flex flex-col space-y-2">
    <Button class="w-48" on:click={() => toggleModal(CREATE_BASE_MODAL)} {...rest}>
      <CirclePlusIcon class="mr-2 size-4" />
      {$LL.base.createBase()}
    </Button>
    <Button class="w-48" on:click={() => toggleModal(IMPORT_TEMPLATE_MODAL)} {...rest}>
      <PackageIcon class="mr-2 size-4" />
      {$LL.base.importFromTemplate()}
    </Button>
  </div>
</main>
