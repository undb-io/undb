import type { IColors } from "@undb/table"

export const getFormBgColor = (color: IColors) => {
  const colorMap: Record<IColors, string> = {
    red: "bg-red-500/40",
    green: "bg-green-500/40",
    blue: "bg-blue-500/40",
    yellow: "bg-yellow-500/40",
    gray: "bg-gray-500/40",
    indigo: "bg-indigo-500/40",
    purple: "bg-purple-500/40",
    pink: "bg-pink-500/40",
    black: "bg-black/40",
    orange: "bg-orange-500/40",
    cyan: "bg-cyan-500/40",
    teal: "bg-teal-500/40",
    lime: "bg-lime-500/40",
    emerald: "bg-emerald-500/40",
    sky: "bg-sky-500/40",
    violet: "bg-violet-500/40",
    rose: "bg-rose-500/40",
  }

  return colorMap[color]
}

export const getFormSelectedColor = (color: IColors) => {
  const colorMap: Record<IColors, string> = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    black: "bg-black",
    orange: "bg-orange-500",
    cyan: "bg-cyan-500",
    teal: "bg-teal-500",
    lime: "bg-lime-500",
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    violet: "bg-violet-500",
    rose: "bg-rose-500",
  }

  return colorMap[color]
}

export const getFormBorderColor = (color: IColors) => {
  const colorMap: Record<IColors, string> = {
    red: "border-red-500",
    green: "border-green-500",
    blue: "border-blue-500",
    yellow: "border-yellow-500",
    gray: "border-gray-500",
    indigo: "border-indigo-500",
    purple: "border-purple-500",
    pink: "border-pink-500",
    black: "border-black",
    orange: "border-orange-500",
    cyan: "border-cyan-500",
    teal: "border-teal-500",
    lime: "border-lime-500",
    emerald: "border-emerald-500",
    sky: "border-sky-500",
    violet: "border-violet-500",
    rose: "border-rose-500",
  }

  return colorMap[color]
}
