<script lang="ts">
	import cx from 'classnames'
	import type { SelectField } from '@undb/core'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import Option from './Option.svelte'
	import { t } from '$lib/i18n'

	export let field: SelectField | undefined
	export let readonly = false

	export let group: string | undefined

	$: option = group ? field?.options.getById(group).into() : null
	$: options = field?.options?.options ?? []
</script>

<DropdownMenu.Root positioning={{ placement: 'bottom-start' }}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			type="button"
			class={cx('h-full', $$restProps.class)}
			variant="outline"
			disabled={readonly}
			builders={[builder]}
		>
			{#if option}
				<Option {option} />
			{:else}
				<span class="inline-flex items-center gap-2">
					<i class="ti ti-plus" />
					<span>{$t('Select Option')}</span>
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value={group}>
			{#each options as option}
				<DropdownMenu.RadioItem class="cursor-pointer flex " value={option.key.value} {...$$restProps}>
					<span role="button" class="inline-flex w-full hover:bg-gray-100 dark:hover:bg-gray-400 transition">
						<Option {option} />
					</span>
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
