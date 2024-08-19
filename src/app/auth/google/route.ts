import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url)
        const supabase = createClient()

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${requestUrl.origin}/auth/callback`,
            },
        })

        if (error) throw error

        return NextResponse.redirect(data.url)
    } catch (error: any) {
        console.error('Google sign-in error:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}