import { supabase } from './client'

export type AdminUser = {
    id: string
    email: string
    is_approved: boolean
    created_at: string
}

export async function getPendingAdmins() {
    const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as AdminUser[]
}

export async function approveAdmin(id: string) {
    const { error } = await supabase
        .from('admins')
        .update({ is_approved: true })
        .eq('id', id)

    if (error) throw error
}

export async function isAdminApproved(id: string) {
    const { data, error } = await supabase
        .from('admins')
        .select('is_approved')
        .eq('id', id)
        .eq('id', id)
        .maybeSingle()

    if (error) throw error
    return data?.is_approved ?? false
}
