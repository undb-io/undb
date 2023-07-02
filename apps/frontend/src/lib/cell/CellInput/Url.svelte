<script lang="ts">
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import type { EmailField } from '@undb/core'
	import { Input } from 'flowbite-svelte'
	export let value: string | undefined = undefined
	export let field: EmailField
</script>

<Input bind:value placeholder="https://example.com" {...$$restProps} autocomplete="off" type="url">
	<FieldIcon size={16} type={field.type} slot="left" />
</Input>
