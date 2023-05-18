<script lang="ts">
	import { Label } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
	import FieldPicker from './FieldPicker.svelte'
	import { allTableFields, getForeignTableFieldsByReferenceId } from '$lib/store/table'

	export let value: string
	export let required = false

	$: fields = $allTableFields
</script>

<Label class="space-y-2">
	<div class="space-x-1">
		<span>{$t('Reference Field')}</span>
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</div>
	<FieldPicker
		{...$$restProps}
		{fields}
		bind:value
		filter={(f) => f.type === 'reference' || f.type === 'tree' || f.type === 'parent'}
	/>
</Label>
