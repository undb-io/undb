<script lang="ts">
	import { RevoGrid } from '@revolist/svelte-datagrid'
	import type { Components } from '@revolist/revogrid'
	import { defineCustomElements } from '@revolist/revogrid/loader'

	let source: Components.RevoGrid['source']
	let headers: Components.RevoGrid['columns']

	defineCustomElements().then(() => {
		// then apply data or rerender
		source = [
			{
				prop: 'name',
				name: 'First',
			},
			{
				prop: 'details',
				name: 'Second',
			},
		]
		headers = [
			{
				name: 'hello',
				details: 'Item 1',
			},
		]
	})
</script>

<RevoGrid {source} resize="true" columns={headers} theme="material" />
