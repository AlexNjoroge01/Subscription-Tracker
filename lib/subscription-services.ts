/**
 * Popular subscription services with their simple-icons slugs and categories
 * Users can easily select from these predefined services instead of manually entering logo URLs
 */

export interface SubscriptionService {
  name: string
  slug: string // simple-icons slug for the SVG
  category: string // subscription category hint
  color: string // brand hex color from simple-icons
}

/**
 * Popular subscription services organized by category
 * Using simple-icons for consistent, high-quality logos
 */
export const subscriptionServices: SubscriptionService[] = [
  // Streaming - Video
  { name: 'Netflix', slug: 'netflix', category: 'Entertainment', color: '#E50914' },
  { name: 'Disney+', slug: 'disneyplus', category: 'Entertainment', color: '#000CC7' },
  { name: 'Hulu', slug: 'hulu', category: 'Entertainment', color: '#1CE783' },
  { name: 'HBO Max', slug: 'hbomax', category: 'Entertainment', color: '#5C37AF' },
  { name: 'Amazon Prime Video', slug: 'amazonprime', category: 'Entertainment', color: '#00A8E1' },
  { name: 'Apple TV+', slug: 'appletv', category: 'Entertainment', color: '#000000' },
  { name: 'YouTube Premium', slug: 'youtube', category: 'Entertainment', color: '#FF0000' },
  { name: 'Paramount+', slug: 'paramountplus', category: 'Entertainment', color: '#0064FF' },
  { name: 'Peacock', slug: 'peacock', category: 'Entertainment', color: '#000000' },
  { name: 'Crunchyroll', slug: 'crunchyroll', category: 'Entertainment', color: '#F47521' },
  { name: 'Viki', slug: 'viki', category: 'Entertainment', color: '#00B2E3' },

  // Streaming - Music
  { name: 'Spotify', slug: 'spotify', category: 'Music', color: '#1DB954' },
  { name: 'Apple Music', slug: 'applemusic', category: 'Music', color: '#FA243C' },
  { name: 'YouTube Music', slug: 'youtubemusic', category: 'Music', color: '#FF0000' },
  { name: 'Tidal', slug: 'tidal', category: 'Music', color: '#000000' },
  { name: 'Deezer', slug: 'deezer', category: 'Music', color: '#FEAA2D' },
  { name: 'SoundCloud', slug: 'soundcloud', category: 'Music', color: '#FF5500' },
  { name: 'Pandora', slug: 'pandora', category: 'Music', color: '#224093' },
  { name: 'Amazon Music', slug: 'amazonmusic', category: 'Music', color: '#25D1DA' },

  // Cloud Storage
  { name: 'Google One', slug: 'google', category: 'Cloud Storage', color: '#4285F4' },
  { name: 'iCloud+', slug: 'icloud', category: 'Cloud Storage', color: '#3693F3' },
  { name: 'Dropbox', slug: 'dropbox', category: 'Cloud Storage', color: '#0061FF' },
  { name: 'Microsoft OneDrive', slug: 'microsoftonedrive', category: 'Cloud Storage', color: '#0078D4' },
  { name: 'Box', slug: 'box', category: 'Cloud Storage', color: '#0061D5' },
  { name: 'Mega', slug: 'mega', category: 'Cloud Storage', color: '#D9272E' },

  // Productivity & Software
  { name: 'Microsoft 365', slug: 'microsoft', category: 'Productivity', color: '#D83B01' },
  { name: 'Google Workspace', slug: 'google', category: 'Productivity', color: '#4285F4' },
  { name: 'Notion', slug: 'notion', category: 'Productivity', color: '#000000' },
  { name: 'Slack', slug: 'slack', category: 'Productivity', color: '#4A154B' },
  { name: 'Zoom', slug: 'zoom', category: 'Productivity', color: '#2D8CFF' },
  { name: 'Figma', slug: 'figma', category: 'Productivity', color: '#F24E1E' },
  { name: 'Canva', slug: 'canva', category: 'Productivity', color: '#00C4CC' },
  { name: 'Adobe Creative Cloud', slug: 'adobe', category: 'Productivity', color: '#FF0000' },
  { name: 'Evernote', slug: 'evernote', category: 'Productivity', color: '#00A82D' },
  { name: 'Todoist', slug: 'todoist', category: 'Productivity', color: '#E44332' },
  { name: 'Trello', slug: 'trello', category: 'Productivity', color: '#0052CC' },
  { name: 'Asana', slug: 'asana', category: 'Productivity', color: '#F06A6A' },
  { name: 'Airtable', slug: 'airtable', category: 'Productivity', color: '#18BFFF' },
  { name: 'Miro', slug: 'miro', category: 'Productivity', color: '#FFD02F' },
  { name: 'Linear', slug: 'linear', category: 'Productivity', color: '#5E6AD2' },
  { name: 'Jira', slug: 'jira', category: 'Productivity', color: '#0052CC' },
  { name: 'GitHub', slug: 'github', category: 'Productivity', color: '#181717' },
  { name: 'GitLab', slug: 'gitlab', category: 'Productivity', color: '#FC6D26' },
  { name: 'Bitbucket', slug: 'bitbucket', category: 'Productivity', color: '#0052CC' },

  // Gaming
  { name: 'PlayStation Plus', slug: 'playstation', category: 'Gaming', color: '#003791' },
  { name: 'Xbox Game Pass', slug: 'xbox', category: 'Gaming', color: '#107C10' },
  { name: 'Nintendo Switch Online', slug: 'nintendoswitch', category: 'Gaming', color: '#E60012' },
  { name: 'EA Play', slug: 'ea', category: 'Gaming', color: '#000000' },
  { name: 'Ubisoft+', slug: 'ubisoft', category: 'Gaming', color: '#0070FF' },
  { name: 'GeForce NOW', slug: 'nvidia', category: 'Gaming', color: '#76B900' },

  // News & Reading
  { name: 'The New York Times', slug: 'nytimes', category: 'News', color: '#000000' },
  { name: 'The Washington Post', slug: 'washingtonpost', category: 'News', color: '#000000' },
  { name: 'The Guardian', slug: 'theguardian', category: 'News', color: '#052962' },
  { name: 'Medium', slug: 'medium', category: 'News', color: '#000000' },
  { name: 'Substack', slug: 'substack', category: 'News', color: '#FF6719' },
  { name: 'Scribd', slug: 'scribd', category: 'Reading', color: '#1E7B85' },
  { name: 'Audible', slug: 'audible', category: 'Reading', color: '#F7991C' },
  { name: 'Kindle Unlimited', slug: 'amazonkindle', category: 'Reading', color: '#FF9900' },
  { name: 'Blinkist', slug: 'blinkist', category: 'Reading', color: '#2D2D2D' },

  // VPN & Security
  { name: 'NordVPN', slug: 'nordvpn', category: 'VPN', color: '#4687FF' },
  { name: 'ExpressVPN', slug: 'expressvpn', category: 'VPN', color: '#DA3940' },
  { name: 'Surfshark', slug: 'surfshark', category: 'VPN', color: '#1EBFBF' },
  { name: 'CyberGhost', slug: 'cyberghost', category: 'VPN', color: '#F0D525' },
  { name: 'ProtonVPN', slug: 'protonvpn', category: 'VPN', color: '#6D4AFF' },
  { name: '1Password', slug: '1password', category: 'Security', color: '#1A8CFF' },
  { name: 'LastPass', slug: 'lastpass', category: 'Security', color: '#D32D27' },
  { name: 'Bitwarden', slug: 'bitwarden', category: 'Security', color: '#175DDC' },
  { name: 'Dashlane', slug: 'dashlane', category: 'Security', color: '#0E35BF' },

  // AI & Developer Tools
  { name: 'ChatGPT Plus', slug: 'openai', category: 'AI', color: '#412991' },
  { name: 'Claude', slug: 'anthropic', category: 'AI', color: '#D97757' },
  { name: 'GitHub Copilot', slug: 'github', category: 'Developer Tools', color: '#000000' },
  { name: 'JetBrains', slug: 'jetbrains', category: 'Developer Tools', color: '#000000' },
  { name: 'Vercel', slug: 'vercel', category: 'Developer Tools', color: '#000000' },
  { name: 'Netlify', slug: 'netlify', category: 'Developer Tools', color: '#00C7B7' },
  { name: 'Heroku', slug: 'heroku', category: 'Developer Tools', color: '#430098' },
  { name: 'DigitalOcean', slug: 'digitalocean', category: 'Developer Tools', color: '#0080FF' },
  { name: 'AWS', slug: 'amazonaws', category: 'Developer Tools', color: '#FF9900' },
  { name: 'Google Cloud', slug: 'googlecloud', category: 'Developer Tools', color: '#4285F4' },
  { name: 'Azure', slug: 'microsoftazure', category: 'Developer Tools', color: '#0078D4' },

  // Communication
  { name: 'Discord Nitro', slug: 'discord', category: 'Communication', color: '#5865F2' },
  { name: 'Telegram Premium', slug: 'telegram', category: 'Communication', color: '#26A5E4' },
  { name: 'WhatsApp Business', slug: 'whatsapp', category: 'Communication', color: '#25D366' },

  // Health & Fitness
  { name: 'Headspace', slug: 'headspace', category: 'Health', color: '#F47D31' },
  { name: 'Calm', slug: 'calm', category: 'Health', color: '#38B6FF' },
  { name: 'MyFitnessPal', slug: 'myfitnesspal', category: 'Health', color: '#0066CC' },
  { name: 'Strava', slug: 'strava', category: 'Health', color: '#FC4C02' },
  { name: 'Peloton', slug: 'peloton', category: 'Health', color: '#181A1D' },
  { name: 'Noom', slug: 'noom', category: 'Health', color: '#F7B731' },

  // Learning & Education
  { name: 'Coursera', slug: 'coursera', category: 'Education', color: '#0056D2' },
  { name: 'Udemy', slug: 'udemy', category: 'Education', color: '#A435F0' },
  { name: 'Skillshare', slug: 'skillshare', category: 'Education', color: '#00FF84' },
  { name: 'LinkedIn Learning', slug: 'linkedin', category: 'Education', color: '#0A66C2' },
  { name: 'Pluralsight', slug: 'pluralsight', category: 'Education', color: '#F15B2A' },
  { name: 'MasterClass', slug: 'masterclass', category: 'Education', color: '#000000' },
  { name: 'Brilliant', slug: 'brilliant', category: 'Education', color: '#F6B635' },
  { name: 'Duolingo', slug: 'duolingo', category: 'Education', color: '#58CC02' },

  // Design & Creative
  { name: 'Envato Elements', slug: 'envato', category: 'Design', color: '#81B441' },
  { name: 'Pexels', slug: 'pexels', category: 'Design', color: '#05A081' },
  { name: 'Unsplash', slug: 'unsplash', category: 'Design', color: '#000000' },
  { name: 'Shutterstock', slug: 'shutterstock', category: 'Design', color: '#EE2B24' },
  { name: 'Adobe Stock', slug: 'adobe', category: 'Design', color: '#FF0000' },

  // Finance & Business
  { name: 'QuickBooks', slug: 'quickbooks', category: 'Finance', color: '#2CA01C' },
  { name: 'FreshBooks', slug: 'freshbooks', category: 'Finance', color: '#00A1E0' },
  { name: 'Xero', slug: 'xero', category: 'Finance', color: '#13B5EA' },
  { name: 'Wave', slug: 'waveapps', category: 'Finance', color: '#1C8FDC' },
  { name: 'Zoho', slug: 'zoho', category: 'Business', color: '#C8202B' },
  { name: 'Salesforce', slug: 'salesforce', category: 'Business', color: '#00A1E0' },
  { name: 'HubSpot', slug: 'hubspot', category: 'Business', color: '#FF7A59' },
  { name: 'Mailchimp', slug: 'mailchimp', category: 'Business', color: '#FFE01B' },
  { name: 'Zendesk', slug: 'zendesk', category: 'Business', color: '#03363D' },
  { name: 'Intercom', slug: 'intercom', category: 'Business', color: '#1F8DED' },

  // E-commerce & Shopping
  { name: 'Amazon Prime', slug: 'amazon', category: 'Shopping', color: '#FF9900' },
  { name: 'Shopify', slug: 'shopify', category: 'Business', color: '#7AB55C' },
  { name: 'Wix', slug: 'wix', category: 'Business', color: '#0C6EFC' },
  { name: 'Squarespace', slug: 'squarespace', category: 'Business', color: '#000000' },

  // Other Popular Services
  { name: 'Patreon', slug: 'patreon', category: 'Entertainment', color: '#FF424D' },
  { name: 'Twitch', slug: 'twitch', category: 'Entertainment', color: '#9146FF' },
  { name: 'OnlyFans', slug: 'onlyfans', category: 'Entertainment', color: '#00AFF0' },
  { name: 'Substack', slug: 'substack', category: 'News', color: '#FF6719' },
  { name: 'Eventbrite', slug: 'eventbrite', category: 'Events', color: '#F05537' },
  { name: 'Meetup', slug: 'meetup', category: 'Events', color: '#ED1C40' },
  { name: 'ClassPass', slug: 'classpass', category: 'Health', color: '#00A3E0' },
  { name: 'Zipcar', slug: 'zipcar', category: 'Transportation', color: '#1DB954' },
  { name: 'Uber One', slug: 'uber', category: 'Transportation', color: '#000000' },
  { name: 'Lyft Pink', slug: 'lyft', category: 'Transportation', color: '#FF00BF' },
]

/**
 * Get unique categories from subscription services
 */
export const subscriptionCategories = Array.from(
  new Set(subscriptionServices.map(s => s.category))
).sort()

/**
 * Search for services by name or category
 */
export function searchServices(query: string): SubscriptionService[] {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return subscriptionServices

  return subscriptionServices.filter(
    service =>
      service.name.toLowerCase().includes(lowerQuery) ||
      service.category.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get services by category
 */
export function getServicesByCategory(category: string): SubscriptionService[] {
  return subscriptionServices.filter(service => service.category === category)
}

/**
 * Get a service by slug
 */
export function getServiceBySlug(slug: string): SubscriptionService | undefined {
  return subscriptionServices.find(service => service.slug === slug)
}

/**
 * Get a service by name
 */
export function getServiceByName(name: string): SubscriptionService | undefined {
  return subscriptionServices.find(
    service => service.name.toLowerCase() === name.toLowerCase()
  )
}
