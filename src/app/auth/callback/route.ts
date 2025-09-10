import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClientForServer } from '@/utils/supabase'

export async function GET(request: any) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClientForServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {

        return NextResponse.redirect(`http://localhost:3000/dashboard`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
