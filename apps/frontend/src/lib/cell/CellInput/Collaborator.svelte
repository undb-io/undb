<script lang="ts">
	import type { CollaboratorField, Record } from '@undb/core'
	import UsersPicker from './UsersPicker.svelte'

	export let value: string[] | undefined = []
	export let record: Record | undefined
	export let field: CollaboratorField

	$: displayValues = record?.displayValues?.values
	$: values = field.getDisplayValues(displayValues) ?? []
	$: initialMembers = new Map(
		value?.map((userId, index) => {
			const [username, avatar, color] = (values ?? [])[index] ?? []
			return [userId, { userId, avatar, username: username ?? '', color }]
		}),
	)
</script>

<UsersPicker {initialMembers} bind:value {...$$restProps} />
