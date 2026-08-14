// Path: frontend/src/context/ThemeContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ColorScheme = 'gold' | 'blue' | 'purple' | 'pink' | 'red' | 'green' | 'peach' | 'yellow'

interface ColorPalette {
  primary: string
  primaryLight: string
  primaryDark: string
  name: string
}

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  colorScheme: ColorScheme
  setColorScheme: (color: ColorScheme) => void
  colors: ColorPalette
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colorScheme: 'gold',
  setColorScheme: () => {},
  colors: { primary: '#C9A96E', primaryLight: '#E8D5A3', primaryDark: '#A8894E', name: 'طلایی' }
})

interface ThemeProviderProps {
  children: ReactNode
}

// Color palettes
const colorPalettes: Record<ColorScheme, ColorPalette> = {
  gold: {
    primary: '#C9A96E',
    primaryLight: '#E8D5A3',
    primaryDark: '#A8894E',
    name: 'طلایی'
  },
  blue: {
    primary: '#3B82F6',
    primaryLight: '#93C5FD',
    primaryDark: '#1D4ED8',
    name: 'آبی'
  },
  purple: {
    primary: '#8B5CF6',
    primaryLight: '#C4B5FD',
    primaryDark: '#6D28D9',
    name: 'بنفش'
  },
  pink: {
    primary: '#EC4899',
    primaryLight: '#F9A8D4',
    primaryDark: '#BE185D',
    name: 'صورتی'
  },
  red: {
    primary: '#EF4444',
    primaryLight: '#FCA5A5',
    primaryDark: '#B91C1C',
    name: 'قرمز'
  },
  green: {
    primary: '#10B981',
    primaryLight: '#6EE7B7',
    primaryDark: '#047857',
    name: 'سبز'
  },
  peach: {
    primary: '#F59E0B',
    primaryLight: '#FCD34D',
    primaryDark: '#B45309',
    name: 'ملو'
  },
  yellow: {
    primary: '#EAB308',
    primaryLight: '#FDE047',
    primaryDark: '#A16207',
    name: 'زرد لیمویی'
  }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get initial theme from localStorage
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }

  const getInitialColor = (): ColorScheme => {
    const savedColor = localStorage.getItem('colorScheme') as ColorScheme
    if (savedColor && colorPalettes[savedColor]) {
      return savedColor
    }
    return 'gold'
  }

  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getInitialColor)

  const colors = colorPalettes[colorScheme]

  useEffect(() => {
    localStorage.setItem('theme', theme)
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    document.body.className = theme === 'dark' ? 'dark' : 'light'
  }, [theme])

  useEffect(() => {
    localStorage.setItem('colorScheme', colorScheme)
    const root = document.documentElement
    // Set CSS custom properties for colors
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-primary-light', colors.primaryLight)
    root.style.setProperty('--color-primary-dark', colors.primaryDark)
    root.style.setProperty('--color-primary-rgb', hexToRgb(colors.primary))
  }, [colorScheme, colors])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleSetColor = (color: ColorScheme) => {
    setColorScheme(color)
  }

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      const r = parseInt(result[1], 16)
      const g = parseInt(result[2], 16)
      const b = parseInt(result[3], 16)
      return `${r}, ${g}, ${b}`
    }
    return '201, 169, 110'
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      colorScheme, 
      setColorScheme: handleSetColor,
      colors 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}