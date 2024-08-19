'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react'
import { useState } from 'react'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => {
    try {
      return createClientComponentClient()
    } catch (error) {
      console.error('Error creating Supabase client:', error)
      throw error
    }
  })

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}

export const useSupabase = useSessionContext