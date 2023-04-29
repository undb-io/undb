<script lang="ts">
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import type { StringField } from '@undb/core'
	import { Input } from 'flowbite-svelte'
	export let value: string | undefined = undefined
	export let field: StringField
</script>

<Input bind:value {...$$restProps} autocomplete="off">
	<FieldIcon size={16} type={field.type} slot="left" />
</Input>
