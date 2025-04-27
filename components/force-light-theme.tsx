'use client'

import { useEffect } from 'react'

export default function ForceLightTheme() {
  useEffect(() => {
    // This effect runs only on the client side
    try {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    } catch (e) {
      console.error('Failed to set theme:', e)
    }
  }, [])
  
  return null
}
