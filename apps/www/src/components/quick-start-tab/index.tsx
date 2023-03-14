// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type React from 'react'
import { useState } from 'react'
import './index.css'

interface IProps {
  tabKey?: string
}

export const QuickStartTab: React.FC<IProps> = () => {
  const [selectedTab, setSelectedTab] = useState<string>('PIP')

  return (
    <div className="code-container flex-1 w-full bg-[#131522] rounded-xl p-[20px] text-start">
      <div className="title-wrapper flex justify-between">
        <span className="text-[2.5rem] text-white font-bold"> Quick Start</span>
        <div className="tab-btn h-[38px] bg-[#505263] rounded-2xl py-[4px] px-[8px] flex gap-[4px]">
          {['PIP', 'BREW', 'GIT', 'DOCKER'].map((item) => (
            <div
              style={{ backgroundColor: selectedTab === item ? '#0384c7' : 'unset' }}
              className="tab-item rounded-2xl hover:bg-[#323443] p-[4px] text-center leading-[25px] cursor-pointer text-white text-[14px]"
              onClick={() => {
                setSelectedTab(item)
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      {selectedTab === 'PIP' && <div className="text-white">小兔子</div>}
      <code className="text-white"> 312</code>
    </div>
  )
}
