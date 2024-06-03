<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { CREATE_RLS_MODAL, toggleModal } from "$lib/store/modal.store"
  import { PlusCircleIcon } from "lucide-svelte"
</script>

<Button {...$$restProps} on:click={() => toggleModal(CREATE_RLS_MODAL)}>
  <PlusCircleIcon class="mr-2 h-4 w-4" />
  Create Record Level Security
</Button>
