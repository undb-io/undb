<script lang="ts">
	import { Separator } from '$components/ui/separator'
	import ShareViewButton from '$lib/share/ShareViewButton.svelte'
	import TreeConfigMenu from '$lib/tree/TreeConfigMenu.svelte'
	import CurrentViewButton from '$lib/view/CurrentViewButton.svelte'
	import CreateRecordButton from './CreateRecordButton.svelte'
</script>

<CreateRecordButton />
<CurrentViewButton />

<Separator orientation="vertical" class="mx-1 h-6" />

<TreeConfigMenu />
<ShareViewButton />
