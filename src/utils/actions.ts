'use server'

import { createClientForServer } from '@/utils/supabase'
import { redirect } from 'next/navigation'

const signInWith = (provider: any) => async () => {
    const supabase = await createClientForServer()

    const auth_callback_url = `http://localhost:3000/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
        },
    })

    if (error) {
        console.log(error)
    }

    // @ts-ignore
    redirect(data.url)
}

const signOut = async () => {
    const supabase = await createClientForServer()
    await supabase.auth.signOut()
    redirect(`http://localhost:3000/`)
}

const signinWithGoogle = signInWith('google')

export {
    signinWithGoogle,
    signOut,
}