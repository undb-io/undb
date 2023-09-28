<script lang="ts">
	import type { Props } from '$components/ui/button'
	import Button from '$components/ui/button/button.svelte'
	import { t } from '$lib/i18n'
	import { createTableModal } from '$lib/store/modal'
	import { createTableDefaultValue } from '$lib/store/table'
	import { cn } from '$lib/utils'

	let className: Props['class'] = undefined
	export { className as class }
	export let variant: Props['variant'] = 'default'
	export let size: Props['size'] = 'default'
	export let builders: Props['builders'] = []
	export let baseId: string | undefined = undefined
	export let callback: (() => Promise<any>) | undefined = undefined
</script>

<div class="flex items-center">
	<Button
		class={cn('gap-2', className)}
		{variant}
		{builders}
		{size}
		{...$$restProps}
		on:click={() => {
			if (baseId) {
				createTableDefaultValue.set({
					baseId,
				})
			}

			createTableModal.open(callback)
		}}
	>
		<i class="ti ti-plus"></i>
		<span>
			{$t('Create New Table')}
		</span>
	</Button>
</div>
