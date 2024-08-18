
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { HomeClient } from './HomeClient'
import { DreamItem, UserProfile } from './types/dreamAnalysis'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  let userProfile: UserProfile | null = null
  let initialDreamItems: DreamItem[] = []
  let error: string | null = null

  if (session) {
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      error = profileError.message
    } else {
      userProfile = profile
    }

    // Fetch dream items
    const { data: dreams, error: dreamsError } = await supabase
      .from('dream_analyses')
      .select('*')
      .eq('user_id', session.user.id)

    if (dreamsError) {
      error = dreamsError.message
    } else {
      initialDreamItems = dreams || []
    }
  }

  return (
    <HomeClient
      session={session}
      userProfile={userProfile}
      initialDreamItems={initialDreamItems}
      error={error}
    />
  )
}