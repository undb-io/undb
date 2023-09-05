<script lang="ts">
	import type { Option } from '@undb/core'
	import OptionComponent from './OptionComponent.svelte'

	export let option: Option
</script>

<OptionComponent id={option.key.value} color={option.color} name={option.name.value} {...$$restProps} />
