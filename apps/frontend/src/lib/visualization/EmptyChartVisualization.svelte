<script lang="ts">
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { createFieldInitial, createFieldModal } from '$lib/store/modal'
	import { Button } from 'flowbite-svelte'
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
				createFieldModal.open()
			}}
		>
			<i class="ti ti-plus" />
			<span>{$t('Create New Select Field')}</span>
			<FieldIcon type="select" />
		</Button>
	</div>
</div>
