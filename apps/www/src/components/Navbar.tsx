// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type React from 'react'
import { useState } from 'react'

interface IProps {
  color: string
}

export const Navbar: React.FC<IProps> = ({ color }) => {
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false)
  return (
    <div className="flex flex-col z-20">
      <div
        style={{ backgroundColor: color }}
        className="flex justify-around h-72 items-center gap-20 bg-[transparent] fixed w-screen border-b px-['20px'] shadow"
      >
        <a className="flex h-full gap-1 items-center" href="/">
          <img className="h-2/3" alt="ego.io" src="/apple-touch-icon.png" />
          <span className="font-mono text-2xl font-extrabold">ego</span>
        </a>
        <div className="flex items-center h-full gap-12 font-bold">
          <div
            className="text-1xln relative cursor-pointer"
            onMouseEnter={(e) => {
              e.stopPropagation()
              setIsShowMenu(true)
            }}
            onMouseLeave={(e) => {
              e.stopPropagation()
              setIsShowMenu(false)
            }}
          >
            Show Case
            {isShowMenu && (
              <div className="absolute border-[1px] rounded-xl drop-shadow-xl bg-white flex flex-col py-[8px] px-[16px] gap-[4px] w-[200px] left-[-18px]">
                <a className="text-base h-[24px]" href="/show-case">
                  HR & Recruiting
                </a>
                <a className="text-base h-[24px]" href="/show-case/it-template">
                  IT
                </a>
                <a className="text-base h-[24px]" href="/show-case/marketing-template">
                  Marketing
                </a>
                <a className="text-base h-[24px]" href="/show-case/pmo-template">
                  PMO
                </a>
              </div>
            )}
          </div>
          <a className="text-1xl" href="/documents">
            Docs
          </a>
          <a className="text-1xl" href="/community">
            Community
          </a>
          <a className="text-1xl" href="/pricing">
            Pricing
          </a>
        </div>
        <div className="flex h-full items-center gap-[1.6rem]">
          <button className="rounded-lg border-2 border-[#0a6bde]/50 py-[7px] px-[20px] font-bold">Sign in</button>
          <button className="font-bold bg-[#0a6bde] rounded-lg py-[9px] px-[20px] text-slate-100">Get start</button>
        </div>
      </div>
    </div>
  )
}
