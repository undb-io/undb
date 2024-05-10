<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { createRecordSheetOpen } from './create-record.store';
</script>

<Button size="sm" on:click={() => ($createRecordSheetOpen = true)}>Create Record</Button>
