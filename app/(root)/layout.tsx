
import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { Toaster } from "@/components/ui/toaster"
import { getCurrentUser } from '@/lib/action/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'

// Every page in this group reads the `appwrite-session` cookie, so none of them
// can be prerendered at build time.
export const dynamic = 'force-dynamic'

const Layout = async ({ children }: { children: React.ReactNode }) => {
    let currentUser = null;
    try {
        currentUser = await getCurrentUser();
    } catch (error) {
        console.log("Error while fetching current user", error)
        return redirect('/sign-in');
    }
    if (!currentUser) return redirect('/sign-in');

    return (
        <main className='flex h-screen'>
            {/* Sidebar  */}
            <Sidebar {...currentUser} />
            <section className='flex h-full flex-1 flex-col'>
                <MobileNavigation {...currentUser} />
                <Header userId={currentUser.$id} accountId={currentUser.accountId} />
                <div className='main-content'>{children}</div>
            </section>
            <Toaster />
        </main>
    )
}

export default Layout