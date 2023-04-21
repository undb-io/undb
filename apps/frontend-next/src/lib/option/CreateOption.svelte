<script lang="ts">
	import { createOptionOpen } from '$lib/store/modal'
	import { Button, Input, Modal } from 'flowbite-svelte'
	import OptionColorPicker from './OptionColorPicker.svelte'
	import type { IOptionColorName } from '@undb/core'

	let color: IOptionColorName
	let name = ''
</script>

<Modal
	title="Create New Options"
	bind:open={$createOptionOpen}
	placement="top-center"
	class="w-full rounded-sm"
	size="sm"
	autoclose
>
	<div class="flex gap-2 items-center">
		<OptionColorPicker bind:value={color} />
		<Input
			class="rounded-none outline-none border-none"
			autoFucus
			name="name"
			size="sm"
			type="text"
			bind:value={name}
			placeholder="name"
		/>
	</div>

	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-4">
			<Button size="xs" color="alternative">Cancel</Button>
			<Button size="xs" on:click={() => alert(`${name}, ${color}`)}>Confirm</Button>
		</div>
	</svelte:fragment>
</Modal>
