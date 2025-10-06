'use server'

import { createClientForServer } from '@/utils/supabase'
import { redirect } from 'next/navigation'

const signInWith = (provider: any) => async () => {
    const supabase = await createClientForServer()

    const baseUrl = process.env.SITE_URL! || "https://www.zetarya.com";
    const auth_callback_url = `${baseUrl}/auth/callback`;

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
    const baseUrl = process.env.SITE_URL! || "https://www.zetarya.com";
    redirect(baseUrl)
}

const signinWithOtp = async ( email: string) => {
    const supabase = await createClientForServer()

    const { data, error } = await supabase.auth.signInWithOtp({
        email,
    })

    if (error) {
        console.log('error', error)

        return {
            error: error.message,
        }
    }
}

const verifyOtp = async (email: string, token: string) => {
    const supabase = await createClientForServer()

    const { data, error } = await supabase.auth.verifyOtp({
        token,
        email,
        type: 'email',
    })

    if (error) {
        console.log('error', error)

        return {
            success: null,
            error: error.message,
        }
    }
}

const signinWithGoogle = signInWith('google')

export {
    signinWithGoogle,
    signOut,
    signinWithOtp,
    verifyOtp,
}
