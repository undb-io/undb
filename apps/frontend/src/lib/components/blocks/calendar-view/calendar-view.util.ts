import { IColors } from "@undb/table"

export function getColor(color: IColors) {
  const map: Record<IColors, string> = {
    red: "border-red-200 bg-red-50 text-red-800 hover:bg-red-100",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100",
    blue: "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100",
    green: "border-green-200 bg-green-50 text-green-800 hover:bg-green-100",
    purple: "border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100",
    gray: "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100",
    orange: "border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100",
    pink: "border-pink-200 bg-pink-50 text-pink-800 hover:bg-pink-100",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100",
    teal: "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100",
    lime: "border-lime-200 bg-lime-50 text-lime-800 hover:bg-lime-100",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    sky: "border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100",
    violet: "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100",
    rose: "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100",
    black: "border-black/50 bg-black/50 text-white hover:bg-black/60",
  }
  return map[color]
}
