<script lang="ts">
	import { t } from '$lib/i18n'
	import { q } from '$lib/store/table'
	import { Search, Button } from 'flowbite-svelte'

	let value: string

	$: if (!value) $q = undefined

	const placeholder = $t('Search')
</script>

<form
	on:submit={() => {
		$q = value || undefined
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
