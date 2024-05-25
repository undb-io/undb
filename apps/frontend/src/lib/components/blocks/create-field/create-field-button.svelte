<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { toggleModal, CREATE_FIELD_MODAL } from "$lib/store/modal.store"
  import { BetweenVerticalStartIcon } from "lucide-svelte"
</script>

<Button size="sm" variant="outline" on:click={() => toggleModal(CREATE_FIELD_MODAL)}>
  <BetweenVerticalStartIcon class="mr-1 h-4 w-4" />
  Create Field
</Button>
