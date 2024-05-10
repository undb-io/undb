<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { BetweenHorizonalEnd } from 'lucide-svelte';
	import { createRecordSheetOpen } from './create-record.store';
</script>

<Button size="xs" on:click={() => ($createRecordSheetOpen = true)}>
  <BetweenHorizonalEnd class="mr-1 h-3 w-3"/>
  Create Record
</Button>
