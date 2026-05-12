import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { PERSONAS, DEFAULT_PERSONA, type Persona, type PersonaId } from '@/data/personas'

interface PersonaContextValue {
  persona: Persona
  setPersonaById: (id: PersonaId) => void
}

const PersonaContext = createContext<PersonaContextValue>({
  persona: DEFAULT_PERSONA,
  setPersonaById: () => {},
})

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>(DEFAULT_PERSONA)

  const setPersonaById = (id: PersonaId) => {
    const found = PERSONAS.find(p => p.id === id)
    if (found) setPersona(found)
  }

  return React.createElement(
    PersonaContext.Provider,
    { value: { persona, setPersonaById } },
    children
  )
}

export function usePersona() {
  return useContext(PersonaContext)
}
