'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, Check, X } from 'lucide-react'
import * as simpleIcons from 'simple-icons'
import { categoryIcons, type CategoryIcon } from '@/lib/category-icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface IconPickerProps {
  value: string // Current icon slug or URL
  onChange: (value: string) => void
  color?: string // Category color for background
}

// Type for simple-icons
type SimpleIcon = {
  title: string
  slug: string
  svg: string
  source: string
  hex: string
  guidelines: string
  license: {
    type: string
    url: string
    attribution: string
  }
}

// Convert simple-icons object to typed record
const si = simpleIcons as unknown as Record<string, SimpleIcon>

export function IconPicker({ value, onChange, color }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      return categoryIcons
    }
    const lowerSearch = search.toLowerCase()
    return categoryIcons.filter(
      icon => icon.name.toLowerCase().includes(lowerSearch)
    )
  }, [search])

  // Get the currently selected icon
  const selectedIcon = useMemo(() => {
    if (!value) return null
    // Try to find by slug (extracted from URL or direct slug)
    const slugMatch = value.match(/simple-icons:([a-z0-9-]+)/)
    if (slugMatch) {
      return categoryIcons.find(icon => icon.slug === slugMatch[1])
    }
    // Direct slug match
    return categoryIcons.find(icon => icon.slug === value)
  }, [value])

  // Get SVG for an icon
  const getIconSvg = (icon: CategoryIcon): string | null => {
    const iconKey = 'si' + icon.slug.charAt(0).toUpperCase() + icon.slug.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const siIcon = si[iconKey]
    if (siIcon) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(siIcon.svg)}`
    }
    return null
  }

  // Handle icon selection
  const handleSelect = (icon: CategoryIcon) => {
    // Store as a special format that indicates it's a simple-icon
    onChange(`simple-icons:${icon.slug}`)
    setIsOpen(false)
    setSearch('')
  }

  // Clear selection
  const handleClear = () => {
    onChange('')
  }

  // Get display URL for the selected icon
  const getDisplayUrl = (icon: CategoryIcon | null): string | null => {
    if (!icon) return null
    return getIconSvg(icon)
  }

  // Get background color
  const bgColor = color || selectedIcon?.color || '#64748b'

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Icon Display / Trigger */}
      <div
        className="flex items-center gap-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm cursor-pointer hover:border-slate-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedIcon ? (
          <>
            <div
              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${bgColor}22` }}
            >
              {getIconSvg(selectedIcon) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getIconSvg(selectedIcon)!}
                  alt={selectedIcon.name}
                  className="w-4 h-4"
                  style={{ filter: `invert(0) sepia(1) saturate(10000%) hue-rotate(${getHueRotate(bgColor)})` }}
                />
              )}
            </div>
            <span className="flex-1 truncate">{selectedIcon.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : value ? (
          <>
            {/* Custom emoji or text */}
            <div
              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-sm"
              style={{ backgroundColor: `${bgColor}22` }}
            >
              {value.length <= 2 ? value : value.charAt(0)}
            </div>
            <span className="flex-1 truncate text-slate-500">Custom icon</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Search className="w-3 h-3 text-slate-400" />
            </div>
            <span className="flex-1 text-slate-400">Select an icon...</span>
          </>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search icons..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Icons Grid */}
          <div className="overflow-y-auto max-h-60 p-2">
            {filteredIcons.length === 0 ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                No icons found
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1">
                {filteredIcons.map((icon) => {
                  const isSelected = selectedIcon?.slug === icon.slug
                  return (
                    <button
                      key={icon.slug}
                      type="button"
                      className={`flex flex-col items-center gap-1 p-2 rounded-md text-center transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                      onClick={() => handleSelect(icon)}
                      title={icon.name}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${icon.color}22` }}
                      >
                        {getIconSvg(icon) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getIconSvg(icon)!}
                            alt={icon.name}
                            className="w-5 h-5"
                            style={{ filter: `invert(0) sepia(1) saturate(10000%) hue-rotate(${getHueRotate(icon.color)})` }}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-600 truncate w-full">{icon.name}</span>
                      {isSelected && (
                        <Check className="w-3 h-3 text-emerald-600 absolute top-1 right-1" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Convert hex color to hue-rotate filter value
 */
function getHueRotate(hexColor: string): string {
  // This is a simplified approach - just return 0 for now
  // The icons will use their natural colors with the background providing the color context
  return '0deg'
}

/**
 * Convert an icon value to a displayable URL
 * This function should be used when displaying icons in the UI
 */
export function getIconUrl(icon: string | null | undefined): string | null {
  if (!icon) return null

  // Check if it's a simple-icon reference
  const slugMatch = icon.match(/simple-icons:([a-z0-9-]+)/)
  if (slugMatch) {
    const slug = slugMatch[1]
    const iconKey = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const siIcon = si[iconKey]
    if (siIcon) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(siIcon.svg)}`
    }
  }

  // Return as-is for regular URLs or emoji
  return icon
}

/**
 * Get the icon data for display
 */
export function getIconData(icon: string | null | undefined): { url: string; color: string } | null {
  if (!icon) return null

  const slugMatch = icon.match(/simple-icons:([a-z0-9-]+)/)
  if (slugMatch) {
    const slug = slugMatch[1]
    const iconKey = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const siIcon = si[iconKey]
    const categoryIcon = categoryIcons.find(c => c.slug === slug)
    
    if (siIcon) {
      return {
        url: `data:image/svg+xml;utf8,${encodeURIComponent(siIcon.svg)}`,
        color: categoryIcon?.color || `#${siIcon.hex}`,
      }
    }
  }

  return null
}
