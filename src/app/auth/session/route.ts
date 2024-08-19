import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        return NextResponse.json({ session })
    } catch (error: any) {
        console.error('Session retrieval error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}