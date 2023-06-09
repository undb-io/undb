<script lang="ts">
	import { t } from '$lib/i18n'
	import { getTable, q, tableQ } from '$lib/store/table'
	import { Search, Button } from 'flowbite-svelte'

	let value: string | undefined = $q

	$: if (!$q) {
		value = ''
	}

	const table = getTable()

	$: if (!value) tableQ.resetTableQ($table.id.value)

	const placeholder = $t('Search')
</script>

<form
	on:submit={() => {
		tableQ.setTableQ($table.id.value, value || undefined)
	}}
>
	<div class="flex items-center gap-2">
		<Search size="sm" bind:value {placeholder} />
		<Button type="submit" size="xs" class="!p-2.5">
			<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</Button>
	</div>
</form>
