/* eslint-disable @typescript-eslint/no-unused-vars */
import { isPlainObject } from 'lodash-es'
import Papa from 'papaparse'
import { flatten } from 'safe-flat'
import { match } from 'ts-pattern'
import { read, utils } from 'xlsx'
import { z } from 'zod'

export type SheetData = (string | number | boolean | null)[][]

export type ParseDataOption = {
	flatten?: boolean
}

const importDataExtensions = z.enum(['csv', 'xlsx', 'xls', 'json'])

export type ImportDataExtensions = z.infer<typeof importDataExtensions>

const getExtension = (filename: string) => filename.split('.').pop()

const parseCsv = async (file: File, options?: ParseDataOption): Promise<SheetData> => {
	return new Promise((resolve) => {
		Papa.parse<string[]>(file, {
			complete(results) {
				resolve(results.data)
			},
		})
	})
}

const parseExcel = async (file: File, options?: ParseDataOption): Promise<SheetData> => {
	const wb = read(await file.arrayBuffer())
	const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })
	return data as SheetData
}

const parseJSON = async (file: File, options?: ParseDataOption): Promise<SheetData> => {
	const text = await file.text()
	let json = JSON.parse(text)
	if (isPlainObject(json)) {
		const data: unknown[][] = [[], []]

		json = options?.flatten ? flatten(json) : json

		for (const [key, value] of Object.entries(json)) {
			data[0].push(key)
			data[1].push(value)
		}

		return data as SheetData
	}

	return []

	return []
}

export const parse = async (
	file: File,
	options?: ParseDataOption,
): Promise<{ name: string; extension: ImportDataExtensions; data: SheetData }> => {
	const fileName = file.name
	const ext = importDataExtensions.parse(getExtension(fileName))

	const data = await match(ext)
		.with('csv', () => parseCsv(file, options))
		.with('xlsx', 'xls', () => parseExcel(file, options))
		.with('json', () => parseJSON(file, options))
		.exhaustive()

	return {
		data,
		extension: ext,
		name: fileName,
	}
}
