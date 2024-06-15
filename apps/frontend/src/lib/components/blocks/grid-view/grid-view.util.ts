import type { IColors } from "@undb/table"

export function getColor(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "bg-black",
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    gray: "bg-gray-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    cyan: "bg-cyan-500",
    teal: "bg-teal-500",
    indigo: "bg-indigo-500",
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
