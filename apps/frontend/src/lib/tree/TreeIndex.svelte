<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Card } from 'flowbite-svelte'
	import type { TreeField } from '@undb/core'
	import TreeConfig from './TreeConfig.svelte'
	import TreeView from './TreeView.svelte'

	const table = getTable()
	const view = getView()

	$: fieldId = $view.treeFieldIdString
	$: field = fieldId ? ($table.schema.getFieldById(fieldId).into() as TreeField | undefined) : undefined
</script>

{#if field}
	<TreeView {field} />
{:else}
	<div class="flex items-center justify-center h-screen w-full bg-gray-100 dark:bg-slate-800/80">
		<Card class="flex-1">
			<TreeConfig />
		</Card>
	</div>
{/if}
