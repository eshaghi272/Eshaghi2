// Path: frontend/src/components/common/ColorPicker.tsx
import { useContext, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { FaPalette } from 'react-icons/fa'

interface ColorOption {
  value: string
  color: string
}

export default function ColorPicker() {
  const { colorScheme, setColorScheme, colors } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)

  const colorOptions: ColorOption[] = [
    { value: 'gold', color: '#C9A96E' },
    { value: 'blue', color: '#3B82F6' },
    { value: 'purple', color: '#8B5CF6' },
    { value: 'pink', color: '#EC4899' },
    { value: 'red', color: '#EF4444' },
    { value: 'green', color: '#10B981' },
    { value: 'peach', color: '#F59E0B' },
    { value: 'yellow', color: '#EAB308' },
  ]

  return (
    <div className="relative">
      {/* دکمه پالت کوچک - فقط آیکون */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
        aria-label="تغییر رنگ"
      >
        <FaPalette 
          className="text-lg transition-all duration-300" 
          style={{ color: colors.primary }}
        />
        {/* نشانگر رنگ فعلی */}
        <span 
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
      </button>

      {/* منوی بازشو - پالت رنگ */}
      {isOpen && (
        <div className="absolute left-0 md:left-auto md:right-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 min-w-[200px]">
          <div className="grid grid-cols-4 gap-1.5">
            {colorOptions.map((option) => {
              const isActive = colorScheme === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setColorScheme(option.value as any)
                    setIsOpen(false)
                  }}
                  className={`relative w-9 h-9 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isActive ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-300' : ''
                  }`}
                  style={{ backgroundColor: option.color }}
                  title={option.value}
                >
                  {isActive && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] drop-shadow">
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}