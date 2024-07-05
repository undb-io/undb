import type { IColors } from "@undb/table"

export function getBgColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "bg-black",
    red: "bg-red-500/80",
    green: "bg-green-500/80",
    blue: "bg-blue-500/80",
    yellow: "bg-yellow-500/80",
    purple: "bg-purple-500/80",
    gray: "bg-gray-500/80",
    orange: "bg-orange-500/80",
    pink: "bg-pink-500/80",
    cyan: "bg-cyan-500/80",
    teal: "bg-teal-500/80",
    indigo: "bg-indigo-500/80",
  }
  return map[color]
}

export function getTextColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "text-white",
    red: "text-white",
    green: "text-white",
    blue: "text-white",
    yellow: "text-white",
    purple: "text-white",
    gray: "text-white",
    orange: "text-white",
    pink: "text-white",
    cyan: "text-white",
    teal: "text-white",
    indigo: "text-white",
  }
  return map[color]
}

export function getRingColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "ring-black/10",
    red: "ring-red-500/10",
    green: "ring-green-500/10",
    blue: "ring-blue-500/10",
    yellow: "ring-yellow-500/10",
    purple: "ring-purple-500/10",
    gray: "ring-gray-500/10",
    orange: "ring-orange-500/10",
    pink: "ring-pink-500/10",
    cyan: "ring-cyan-500/10",
    teal: "ring-teal-500/10",
    indigo: "ring-indigo-500/10",
  }
  return map[color]
}
