import type { IColors } from "@undb/table"

export function getBgColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "bg-black",
    red: "bg-red-300/70",
    green: "bg-green-300/70",
    blue: "bg-blue-300/70",
    yellow: "bg-yellow-300/70",
    purple: "bg-purple-300/70",
    gray: "bg-gray-300/70",
    orange: "bg-orange-300/70",
    pink: "bg-pink-300/70",
    cyan: "bg-cyan-300/70",
    teal: "bg-teal-300/70",
    indigo: "bg-indigo-300/70",
    lime: "bg-lime-300/70",
    emerald: "bg-emerald-300/70",
    sky: "bg-sky-300/70",
    violet: "bg-violet-300/70",
    rose: "bg-rose-300/70",
  }
  return map[color]
}

export function getTextColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "text-white",
    red: "text-red-800",
    green: "text-green-800",
    blue: "text-blue-800",
    yellow: "text-yellow-800",
    purple: "text-purple-800",
    gray: "text-gray-800",
    orange: "text-orange-800",
    pink: "text-pink-800",
    cyan: "text-cyan-800",
    teal: "text-teal-800",
    indigo: "text-indigo-800",
    lime: "text-lime-800",
    emerald: "text-emerald-800",
    sky: "text-sky-800",
    violet: "text-violet-800",
    rose: "text-rose-800",
  }
  return map[color]
}

export function getBorderColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "border-black",
    red: "border-red-400",
    green: "border-green-400",
    blue: "border-blue-400",
    yellow: "border-yellow-400",
    purple: "border-purple-400",
    gray: "border-gray-400",
    orange: "border-orange-400",
    pink: "border-pink-400",
    cyan: "border-cyan-400",
    teal: "border-teal-400",
    indigo: "border-indigo-400",
    lime: "border-lime-400",
    emerald: "border-emerald-400",
    sky: "border-sky-400",
    violet: "border-violet-400",
    rose: "border-rose-400",
  }
  return map[color]
}

export function getRingColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "ring-black/10",
    red: "ring-red-200/10",
    green: "ring-green-200/10",
    blue: "ring-blue-200/10",
    yellow: "ring-yellow-200/10",
    purple: "ring-purple-200/10",
    gray: "ring-gray-200/10",
    orange: "ring-orange-200/10",
    pink: "ring-pink-200/10",
    cyan: "ring-cyan-200/10",
    teal: "ring-teal-200/10",
    indigo: "ring-indigo-200/10",
    lime: "ring-lime-200/10",
    emerald: "ring-emerald-200/10",
    sky: "ring-sky-200/10",
    violet: "ring-violet-200/10",
    rose: "ring-rose-200/10",
  }
  return map[color]
}
