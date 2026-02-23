'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, Check, X } from 'lucide-react'
import * as simpleIcons from 'simple-icons'
import { subscriptionServices, subscriptionCategories, type SubscriptionService } from '@/lib/subscription-services'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface LogoPickerProps {
  value: string // Current logo URL or service slug
  onChange: (value: string) => void
  serviceName?: string // Optional: to help auto-suggest
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

export function LogoPicker({ value, onChange, serviceName }: LogoPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    let services = subscriptionServices

    if (search.trim()) {
      const lowerSearch = search.toLowerCase()
      services = services.filter(
        s =>
          s.name.toLowerCase().includes(lowerSearch) ||
          s.category.toLowerCase().includes(lowerSearch)
      )
    }

    if (selectedCategory) {
      services = services.filter(s => s.category === selectedCategory)
    }

    return services
  }, [search, selectedCategory])

  // Get the currently selected service
  const selectedService = useMemo(() => {
    if (!value) return null
    // Try to find by slug (extracted from URL or direct slug)
    const slugMatch = value.match(/simple-icons:([a-z0-9-]+)/)
    if (slugMatch) {
      return subscriptionServices.find(s => s.slug === slugMatch[1])
    }
    // Try to match by name
    if (serviceName) {
      const found = subscriptionServices.find(
        s => s.name.toLowerCase() === serviceName.toLowerCase()
      )
      if (found) return found
    }
    return null
  }, [value, serviceName])

  // Get SVG for a service
  const getServiceIcon = (service: SubscriptionService): string | null => {
    const iconKey = 'si' + service.slug.charAt(0).toUpperCase() + service.slug.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const icon = si[iconKey]
    if (icon) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(icon.svg)}`
    }
    return null
  }

  // Handle service selection
  const handleSelect = (service: SubscriptionService) => {
    // Store as a special format that indicates it's a simple-icon
    onChange(`simple-icons:${service.slug}`)
    setIsOpen(false)
    setSearch('')
    setSelectedCategory(null)
  }

  // Clear selection
  const handleClear = () => {
    onChange('')
  }

  // Get display URL for the selected service
  const getDisplayUrl = (service: SubscriptionService | null): string => {
    if (!service) return value
    const iconUrl = getServiceIcon(service)
    return iconUrl || value
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Service Display / Trigger */}
      <div
        className="flex items-center gap-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm cursor-pointer hover:border-slate-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedService ? (
          <>
            <div
              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `#${selectedService.color}` }}
            >
              {getServiceIcon(selectedService) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getServiceIcon(selectedService)!}
                  alt={selectedService.name}
                  className="w-4 h-4 invert"
                />
              )}
            </div>
            <span className="flex-1 truncate">{selectedService.name}</span>
            <Badge variant="outline" className="text-xs">
              {selectedService.category}
            </Badge>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Custom logo"
              className="w-6 h-6 rounded object-cover"
            />
            <span className="flex-1 truncate text-slate-500">Custom logo URL</span>
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
            <span className="flex-1 text-slate-400">Select a service...</span>
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
                placeholder="Search services..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="p-2 border-b border-slate-100 flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            <Button
              type="button"
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-6"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {subscriptionCategories.map((category) => (
              <Button
                key={category}
                type="button"
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-6"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="overflow-y-auto max-h-52 p-2">
            {filteredServices.length === 0 ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                No services found
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {filteredServices.map((service) => {
                  const isSelected = selectedService?.slug === service.slug
                  return (
                    <button
                      key={service.slug}
                      type="button"
                      className={`flex items-center gap-2 p-2 rounded-md text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                      onClick={() => handleSelect(service)}
                    >
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `#${service.color}` }}
                      >
                        {getServiceIcon(service) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getServiceIcon(service)!}
                            alt={service.name}
                            className="w-4 h-4 invert"
                          />
                        )}
                      </div>
                      <span className="flex-1 truncate text-xs">{service.name}</span>
                      {isSelected && (
                        <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
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
 * Convert a logo value to a displayable URL
 * This function should be used when displaying logos in the UI
 */
export function getLogoUrl(logo: string | null | undefined): string | null {
  if (!logo) return null

  // Check if it's a simple-icon reference
  const slugMatch = logo.match(/simple-icons:([a-z0-9-]+)/)
  if (slugMatch) {
    const slug = slugMatch[1]
    const iconKey = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const icon = si[iconKey]
    if (icon) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(icon.svg)}`
    }
  }

  // Return as-is for regular URLs
  return logo
}

/**
 * Get the brand color for a logo
 */
export function getLogoColor(logo: string | null | undefined): string | null {
  if (!logo) return null

  const slugMatch = logo.match(/simple-icons:([a-z0-9-]+)/)
  if (slugMatch) {
    const slug = slugMatch[1]
    const service = subscriptionServices.find(s => s.slug === slug)
    if (service) {
      return `#${service.color}`
    }
  }

  return null
}
