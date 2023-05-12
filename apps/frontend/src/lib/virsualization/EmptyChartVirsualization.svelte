<script lang="ts">
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { createFieldInitial, createFieldOpen } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import { Button } from 'flowbite-svelte'

	const table = getTable()
</script>

<div {...$$restProps}>
	<div class="flex flex-col justify-center items-center gap-2 h-full">
		<Button
			size="xs"
			color="light"
			class="flex gap-2"
			on:click={() => {
				$createFieldInitial = {
					type: 'select',
				}
				$createFieldOpen = true
			}}
		>
			<i class="ti ti-plus" />
			<span>{$t('Create New Select Field')}</span>
			<FieldIcon type="select" />
		</Button>
	</div>
</div>
