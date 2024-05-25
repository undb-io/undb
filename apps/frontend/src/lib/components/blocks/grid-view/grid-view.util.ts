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
