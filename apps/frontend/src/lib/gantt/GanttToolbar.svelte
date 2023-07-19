<script lang="ts">
	import ShareViewButton from '$lib/share/ShareViewButton.svelte'
	import CreateRecordButton from '$lib/table/CreateRecordButton.svelte'
	import FilterMenu from '$lib/table/FilterMenu.svelte'
	import GanttConfigMenu from './GanttConfigMenu.svelte'
</script>

<CreateRecordButton />
<FilterMenu />
<GanttConfigMenu />
<ShareViewButton />
