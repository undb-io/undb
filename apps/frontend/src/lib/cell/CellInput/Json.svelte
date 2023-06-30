<script lang="ts">
	import type { Json, JsonField } from '@undb/core'
	import { JSONEditor, Mode, type Content, type OnChange } from 'svelte-jsoneditor'
	export let value: Json | undefined = undefined
	export let field: JsonField

	let content: Content = {
		text: undefined,
		json: value ?? {},
	}

	const handleChange: OnChange = (updatedContent, previousContent, { contentErrors, patchResult }) => {
		content = updatedContent
		// @ts-ignore
		if (!contentErrors) value = JSON.parse(content.text)
	}
</script>

<JSONEditor
	{content}
	readOnly={$$restProps.readonly}
	onChange={handleChange}
	mode={Mode.text}
	mainMenuBar={false}
	navigationBar={false}
	statusBar={false}
	askToFormat={false}
/>
