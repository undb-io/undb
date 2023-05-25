<script lang="ts">
	import type { Option as CoreOption } from '@undb/core'
	import Option from '$lib/option/Option.svelte'

	export let value: CoreOption
</script>

<Option option={value} />
