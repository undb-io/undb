/* eslint-disable @typescript-eslint/no-unused-vars */
import { every, isArray, isPlainObject } from 'lodash-es'
import Papa from 'papaparse'
import { flatten } from 'safe-flat'
import { match } from 'ts-pattern'
import { read, utils } from 'xlsx'
import { z } from 'zod'

type CellDataType = string | number | boolean | null
export type SheetData = CellDataType[][]

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
	const json = JSON.parse(text)

	const parsePlainObject = (obj: Record<string, unknown>): SheetData => {
		const data: unknown[][] = [[], []]
		const jsonObject = options?.flatten ? flatten(obj) : obj

		for (const [key, value] of Object.entries(jsonObject)) {
			data[0].push(key)
			data[1].push(value)
		}

		return data as SheetData
	}

	return match(json)
		.returnType<SheetData>()
		.when(isPlainObject, parsePlainObject)
		.when(
			(json) => isArray(json) && json.length >= 1 && every(json, isPlainObject),
			(jsonArray) => {
				const [firstRow, ...restRows] = jsonArray as Record<string, unknown>[]
				const data = parsePlainObject(firstRow)

				for (const [index, obj] of restRows.entries()) {
					data[index + 2] ??= []
					// loop header
					for (const [j, key] of data[0].entries()) {
						data[index + 2][j] = obj[key as string] as CellDataType
					}
				}

				return data
			},
		)
		.otherwise(() => [] as SheetData)
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
