<script lang="ts">
	import { t } from '$lib/i18n'
	import { getTable, q, tableQ } from '$lib/store/table'
	import { Button } from '$components/ui/button'
	import { Input } from '$components/ui/input'
	import { fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { clickOutside, cn } from '$lib/utils'

	let value: string | undefined = $q

	$: if (!$q) {
		value = ''
	}

	const table = getTable()

	$: if (!value) tableQ.resetTableQ($table.id.value)

	const placeholder = $t('Search')

	let show = false
</script>

<form
	use:clickOutside
	on:click_outside={() => (show = false)}
	on:submit={() => {
		tableQ.setTableQ($table.id.value, value || undefined)
	}}
>
	<div class="flex items-center gap-2">
		{#if show}
			<div transition:fly={{ duration: 300, x: 100, easing: quintOut }}>
				<Input bind:value {placeholder} class="min-w-[150px]	 h-8" />
			</div>
		{/if}
		<Button type="submit" variant="ghost" class={cn(show && 'bg-gray-100')} size="icon" on:click={() => (show = true)}>
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
