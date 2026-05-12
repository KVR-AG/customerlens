export type PersonaId = 'ceo' | 'brand_head' | 'country_head' | 'clo' | 'operator'

export interface Persona {
  id: PersonaId
  name: string
  role: string
  brand?: string
  country?: string
  avatar: string
  aiUsagePct: number
}

export const PERSONAS: Persona[] = [
  {
    id: 'ceo',
    name: 'Ahmed Al Mansouri',
    role: 'CEO',
    avatar: 'AM',
    aiUsagePct: 34,
  },
  {
    id: 'brand_head',
    name: 'Sarah Johnson',
    role: 'Brand Head · Centrepoint',
    brand: 'centrepoint',
    avatar: 'SJ',
    aiUsagePct: 82,
  },
  {
    id: 'country_head',
    name: 'Rania El-Sharif',
    role: 'Country Head · UAE',
    country: 'UAE',
    avatar: 'RE',
    aiUsagePct: 61,
  },
  {
    id: 'clo',
    name: 'David Chen',
    role: 'CLO · Central CRM',
    avatar: 'DC',
    aiUsagePct: 47,
  },
  {
    id: 'operator',
    name: 'Priya Nair',
    role: 'Marketing Operator',
    avatar: 'PN',
    aiUsagePct: 93,
  },
]

export const DEFAULT_PERSONA = PERSONAS[1] // Brand Head as default
