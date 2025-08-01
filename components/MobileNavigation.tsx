"use client"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { avatarPlaceholderUrl, navItems } from '@/constant'
import { signOutUser } from '@/lib/action/user.actions'
import { cn } from '@/lib/utils'
import { Separator } from '@radix-ui/react-separator'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import FileUploader from './FileUploader'
import { Button } from './ui/button'

interface Props {
    $id: string,
    accountId: string
    fullName: string
    avatar?: string
    email: string
}

const MobileNavigation = ({ $id: ownerId, accountId, fullName, email }: Props) => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    return (
        <header className='mobile-header'>
            <Image src='/assets/new_icons/logo-full.svg' alt='logo' width={120} height={52} className=' h-auto' />
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Image src='/assets/icons/menu.svg' alt='menu' width={30} height={30} />
                </SheetTrigger>
                <SheetContent className='shad-sheet h-screen px-3'>
                    <SheetHeader>
                        <SheetTitle>
                            <div className='bg-brand mt-8 bg-brand/10 gap-2 rounded-full p-2 flex justify-start w-full'>
                                <Image src={avatarPlaceholderUrl} alt='Avatar' width={44} height={44} className='sidebar-user-avatar' />
                                <div className='block lg:hidden'>
                                    <p className='subtitle-2 capitalize flex justify-start'>{fullName}</p>
                                    <p className='caption'>{email}</p>
                                </div>
                            </div>
                            <Separator className='mb-4 bg-light-200/20' />
                        </SheetTitle>

                        <nav className='mobile-nav'>
                            <ul className='mobile-nav-list'>
                                {navItems.map(({ url, name, icon }) => (
                                    <Link key={name} href={name != 'Profile' ? url : '#'} className='lg:w-full'>
                                        <li className={cn('mobile-nav-item', (pathname === url && 'shad-active'))}>
                                            <Image src={icon} alt={name} width={24} height={24} className={cn('nav-icon', pathname === url && 'nav-icon-active')} />
                                            <p>{name}</p>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        </nav>

                        <Separator className='my-5 bglight-200/20' />

                        <div className='flex flex-col justify-between gap-5 pb-5'>
                            {/* File Uploader */}
                            <FileUploader ownerId={ownerId} accountId={accountId} />
                            <Button type='submit' className='mobile-sign-out-button' onClick={async () => await signOutUser()}>
                                <Image src='/assets/icons/logout.svg' alt='logo' width={24} height={24} /><p>LogOut</p>
                            </Button>
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </header>
    )
}

export default MobileNavigation