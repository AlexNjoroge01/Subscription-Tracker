/**
 * Category icons with their simple-icons slugs
 * Users can select from these predefined icons for their categories
 */

export interface CategoryIcon {
  name: string
  slug: string // simple-icons slug for the SVG
  color: string // suggested hex color
}

/**
 * Category icons organized by type
 * Using simple-icons for consistent, high-quality icons
 */
export const categoryIcons: CategoryIcon[] = [
  // Entertainment
  { name: 'Movie', slug: 'movie', color: '#E50914' },
  { name: 'Music', slug: 'spotify', color: '#1DB954' },
  { name: 'Gaming', slug: 'gamepad', color: '#107C10' },
  { name: 'TV', slug: 'tv', color: '#000CC7' },
  { name: 'YouTube', slug: 'youtube', color: '#FF0000' },
  { name: 'Netflix', slug: 'netflix', color: '#E50914' },

  // Productivity & Work
  { name: 'Code', slug: 'github', color: '#181717' },
  { name: 'Laptop', slug: 'laptop', color: '#0078D4' },
  { name: 'Briefcase', slug: 'briefcase', color: '#4285F4' },
  { name: 'Calendar', slug: 'googlecalendar', color: '#4285F4' },
  { name: 'Mail', slug: 'gmail', color: '#EA4335' },
  { name: 'Document', slug: 'googledocs', color: '#4285F4' },
  { name: 'Spreadsheet', slug: 'googlesheets', color: '#34A853' },
  { name: 'Presentation', slug: 'googleslides', color: '#FBBC04' },

  // Cloud & Tech
  { name: 'Cloud', slug: 'dropbox', color: '#0061FF' },
  { name: 'Server', slug: 'server', color: '#FF9900' },
  { name: 'Database', slug: 'database', color: '#00758F' },
  { name: 'API', slug: 'api', color: '#6D4AFF' },

  // Finance & Shopping
  { name: 'Credit Card', slug: 'creditcard', color: '#1A1F71' },
  { name: 'Shopping', slug: 'shoppingcart', color: '#FF9900' },
  { name: 'Bank', slug: 'bank', color: '#003087' },
  { name: 'Wallet', slug: 'wallet', color: '#00D632' },

  // Health & Fitness
  { name: 'Heart', slug: 'heart', color: '#E91E63' },
  { name: 'Fitness', slug: 'fitness', color: '#FF5722' },
  { name: 'Medical', slug: 'medical', color: '#2196F3' },

  // Education & Learning
  { name: 'Book', slug: 'book', color: '#3F51B5' },
  { name: 'Graduation', slug: 'graduationcap', color: '#9C27B0' },
  { name: 'Lightbulb', slug: 'lightbulb', color: '#FFC107' },

  // Home & Lifestyle
  { name: 'Home', slug: 'home', color: '#795548' },
  { name: 'Car', slug: 'car', color: '#607D8B' },
  { name: 'Pet', slug: 'pet', color: '#8BC34A' },
  { name: 'Food', slug: 'restaurant', color: '#FF5722' },
  { name: 'Coffee', slug: 'coffee', color: '#795548' },

  // Communication
  { name: 'Phone', slug: 'phone', color: '#4CAF50' },
  { name: 'Chat', slug: 'chat', color: '#2196F3' },
  { name: 'Video', slug: 'video', color: '#E91E63' },

  // Security
  { name: 'Shield', slug: 'shield', color: '#00BCD4' },
  { name: 'Lock', slug: 'lock', color: '#9C27B0' },
  { name: 'Key', slug: 'key', color: '#FF9800' },

  // Misc
  { name: 'Star', slug: 'star', color: '#FFC107' },
  { name: 'Bookmark', slug: 'bookmark', color: '#F44336' },
  { name: 'Tag', slug: 'tag', color: '#9E9E9E' },
  { name: 'Folder', slug: 'folder', color: '#FFC107' },
  { name: 'Settings', slug: 'settings', color: '#607D8B' },
  { name: 'Globe', slug: 'globe', color: '#2196F3' },
]

/**
 * Category icon categories for filtering
 */
export const iconCategories = [
  'Entertainment',
  'Productivity',
  'Cloud & Tech',
  'Finance',
  'Health',
  'Education',
  'Home',
  'Communication',
  'Security',
  'Misc',
] as const

export type IconCategory = typeof iconCategories[number]
