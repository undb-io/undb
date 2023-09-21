<script lang="ts">
	import { Separator } from '$components/ui/separator'
	import ShareViewButton from '$lib/share/ShareViewButton.svelte'
	import CreateRecordButton from '$lib/table/CreateRecordButton.svelte'
	import FilterMenu from '$lib/table/FilterMenu.svelte'
	import CurrentViewButton from '$lib/view/CurrentViewButton.svelte'
	import GanttConfigMenu from './GanttConfigMenu.svelte'
</script>

<CreateRecordButton />
<CurrentViewButton />

<Separator orientation="vertical" class="mx-1 h-6" />

<FilterMenu />
<GanttConfigMenu />
<ShareViewButton />
