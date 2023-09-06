<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { BUILT_IN_DATE_FORMATS, DEFAULT_DATE_FORMAT } from '@undb/core'
	import { onMount } from 'svelte'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import { Label } from '$components/ui/label'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let path: any[] = []

	const format = fieldProxy(form.form, [...path, 'format'] as any) as Writable<string>

	onMount(() => {
		if (!$format) {
			$format = DEFAULT_DATE_FORMAT
		}
	})

	const items = BUILT_IN_DATE_FORMATS.map((format) => ({ value: format, name: format }))
</script>

<div>
	<Label class="space-y-2">
		<span>{$t('Date Format')}</span>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" builders={[builder]} {...$$restProps}>
					{$format}
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-64">
				<DropdownMenu.RadioGroup bind:value={$format}>
					{#each items as item}
						<DropdownMenu.RadioItem value={item.value}>{item.name}</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Label>
</div>
