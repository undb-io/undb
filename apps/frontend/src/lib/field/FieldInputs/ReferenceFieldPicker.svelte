<script lang="ts">
	import { Label } from 'flowbite-svelte'
	import { getTable } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import FieldPicker from './FieldPicker.svelte'

	const table = getTable()

	export let value: string
	export let required = false
</script>

<div>
	<Label class="space-y-2">
		<span class="space-x-1">
			<span>{$t('Reference Field')}</span>
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</span>
		<FieldPicker
			{...$$restProps}
			bind:value
			table={$table}
			filter={(f) => f.type === 'reference' || f.type === 'tree' || f.type === 'parent'}
		/>
	</Label>
</div>
