import type { IColors } from "@undb/table"

export function getBorder(color: IColors): string {
  const map: Record<IColors, string> = {
    black: "border-black",
    red: "border-red-500",
    green: "border-green-500",
    blue: "border-blue-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
    gray: "border-gray-500",
    orange: "border-orange-500",
    pink: "border-pink-500",
    cyan: "border-cyan-500",
    teal: "border-teal-500",
    indigo: "border-indigo-500",
  }
  return map[color]
}
