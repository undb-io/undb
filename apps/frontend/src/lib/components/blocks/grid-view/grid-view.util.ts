import type { IColors } from "@undb/table"

export function getBgColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "bg-black",
    red: "bg-red-400/70",
    green: "bg-green-400/70",
    blue: "bg-blue-400/70",
    yellow: "bg-yellow-400/70",
    purple: "bg-purple-400/70",
    gray: "bg-gray-400/70",
    orange: "bg-orange-400/70",
    pink: "bg-pink-400/70",
    cyan: "bg-cyan-400/70",
    teal: "bg-teal-400/70",
    indigo: "bg-indigo-400/70",
    lime: "bg-lime-400/70",
    emerald: "bg-emerald-400/70",
    sky: "bg-sky-400/70",
    violet: "bg-violet-400/70",
    rose: "bg-rose-400/70",
  }
  return map[color]
}

export function getTextColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "text-white",
    red: "text-red-700",
    green: "text-green-700",
    blue: "text-blue-700",
    yellow: "text-yellow-700",
    purple: "text-purple-700",
    gray: "text-gray-700",
    orange: "text-orange-700",
    pink: "text-pink-700",
    cyan: "text-cyan-700",
    teal: "text-teal-700",
    indigo: "text-indigo-700",
    lime: "text-lime-700",
    emerald: "text-emerald-700",
    sky: "text-sky-700",
    violet: "text-violet-700",
    rose: "text-rose-700",
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
